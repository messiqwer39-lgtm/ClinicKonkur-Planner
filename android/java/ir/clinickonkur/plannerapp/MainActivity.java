package ir.clinickonkur.plannerapp;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.media.MediaScannerConnection;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Clinic Konkur Planner — offline WebView wrapper.
 * Loads the built React PWA from android_asset and keeps zero dangerous permissions.
 * v2.1.0: adds a small JS bridge (window.AndroidBridge) so the web app can save
 * generated PNG images (weekly plan / report card) directly into the phone gallery —
 * data URLs / <a download> do NOT work inside an Android WebView.
 */
public class MainActivity extends Activity {

    private static final String START_URL = "file:///android_asset/index.html";
    private static final int REQ_WRITE_STORAGE = 1001;
    private static final String GALLERY_DIR = "ClinicKonkur";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // http(s) links (e.g. Clinic Konkur promo) open in the browser app
                if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (Exception ignored) {
                    }
                    return true;
                }
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return super.shouldInterceptRequest(view, request);
            }
        });

        // Native bridge for saving generated images into the device gallery
        webView.addJavascriptInterface(new WebAppBridge(), "AndroidBridge");

        int bg = Color.parseColor("#0F172A");
        webView.setBackgroundColor(bg);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        getWindow().setStatusBarColor(bg);
        getWindow().setNavigationBarColor(bg);

        // Legacy devices (Android 6..9) need the storage permission granted up-front
        // so saving images from the web app works without a second prompt mid-action.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && Build.VERSION.SDK_INT < Build.VERSION_CODES.Q
                && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQ_WRITE_STORAGE);
        }

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
        }
    }

    /**
     * JS bridge — the web app calls: AndroidBridge.saveImage(dataUrl, fileName, reqId)
     * Result is delivered back to the page via window.__ckImageSaved(reqId, ok).
     */
    private class WebAppBridge {

        @JavascriptInterface
        public void saveImage(String dataUrl, String fileName, String reqId) {
            boolean ok = false;
            try {
                byte[] bytes = decodeDataUrl(dataUrl);
                if (bytes != null && bytes.length > 0) {
                    String name = safeFileName(fileName);
                    ok = saveToGallery(bytes, name);
                }
            } catch (Throwable ignored) {
                ok = false;
            }
            notifyJs(reqId, ok);
        }

        /** Optional helper so the page can detect bridge availability + version. */
        @JavascriptInterface
        public String getVersion() {
            return "2.1.0";
        }
    }

    private void notifyJs(final String reqId, final boolean ok) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (webView != null) {
                    String id = reqId == null ? "0" : reqId.replaceAll("[^0-9A-Za-z_-]", "");
                    webView.evaluateJavascript(
                            "window.__ckImageSaved && window.__ckImageSaved('" + id + "'," + ok + ");",
                            null);
                }
            }
        });
    }

    /** Decodes "data:image/png;base64,...." into raw bytes (android.util.Base64 works on API 21+). */
    private byte[] decodeDataUrl(String dataUrl) {
        if (dataUrl == null) return null;
        String b64 = dataUrl;
        int comma = b64.indexOf(',');
        if (b64.startsWith("data:") && comma != -1) {
            b64 = b64.substring(comma + 1);
        }
        try {
            return android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String safeFileName(String fileName) {
        String name = (fileName == null || fileName.trim().isEmpty())
                ? "ClinicKonkur_" + System.currentTimeMillis() + ".png"
                : fileName.trim().replaceAll("[\\\\/:*?\"<>|]", "_");
        if (!name.toLowerCase().endsWith(".png") && !name.toLowerCase().endsWith(".jpg")
                && !name.toLowerCase().endsWith(".jpeg")) {
            name += ".png";
        }
        return name;
    }

    /**
     * Saves bytes into the public Pictures gallery.
     * API 29+  : MediaStore with RELATIVE_PATH Pictures/ClinicKonkur (no permission needed).
     * API 21-28: direct file write into Pictures/ClinicKonkur + media scanner
     *            (WRITE_EXTERNAL_STORAGE requested at startup, pre-granted by the user).
     */
    private boolean saveToGallery(byte[] data, String fileName) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return saveViaMediaStore(data, fileName);
        }
        return saveLegacy(data, fileName);
    }

    private boolean saveViaMediaStore(byte[] data, String fileName) {
        ContentValues cv = new ContentValues();
        cv.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
        cv.put(MediaStore.Images.Media.MIME_TYPE,
                fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
        cv.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/" + GALLERY_DIR);
        cv.put(MediaStore.Images.Media.IS_PENDING, 1);

        Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv);
        if (uri == null) return false;

        OutputStream os = null;
        try {
            os = getContentResolver().openOutputStream(uri);
            if (os == null) return false;
            os.write(data);
            os.flush();
            return true;
        } catch (IOException e) {
            return false;
        } finally {
            if (os != null) {
                try { os.close(); } catch (IOException ignored) {}
            }
            ContentValues done = new ContentValues();
            done.put(MediaStore.Images.Media.IS_PENDING, 0);
            try {
                getContentResolver().update(uri, done, null, null);
            } catch (Exception ignored) {}
        }
    }

    private boolean saveLegacy(byte[] data, String fileName) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        try {
            File pictures = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
            File dir = new File(pictures, GALLERY_DIR);
            if (!dir.exists() && !dir.mkdirs()) return false;

            File file = new File(dir, fileName);
            int dot = fileName.lastIndexOf('.');
            String stem = dot > 0 ? fileName.substring(0, dot) : fileName;
            String ext = dot > 0 ? fileName.substring(dot) : ".png";
            int n = 1;
            while (file.exists()) {
                file = new File(dir, stem + "_" + n + ext);
                n++;
            }
            FileOutputStream fos = new FileOutputStream(file);
            try {
                fos.write(data);
                fos.flush();
            } finally {
                fos.close();
            }
            MediaScannerConnection.scanFile(this, new String[]{file.getAbsolutePath()},
                    new String[]{fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg"}, null);
            return true;
        } catch (IOException | SecurityException e) {
            return false;
        }
    }

    private String getMimeType(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".ttf")) return "font/ttf";
        return "application/octet-stream";
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
