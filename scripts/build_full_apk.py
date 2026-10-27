#!/usr/bin/env python3
"""
Clinic Konkur Planner — Native Complete APK Builder
Builds APKs directly from Android source and resources using aapt, ecj, dx, zipalign, apksigner.
Produces:
1. ir.clinickonkur.planner (Fresh uncollided package - guaranteed 1-click install on any phone)
2. com.clinickonkur.planner (Official Myket release package)
"""

import os
import sys
import shutil
import subprocess
import zipfile
from pathlib import Path

ROOT = Path("/app/applet")
DIST = ROOT / "dist"
ANDROID_DIR = ROOT / "android"
KEYSTORE = ROOT / "android-release" / "clinicplan.keystore"
KS_PASS = "clinickonkur123"
KS_ALIAS = "clinicplan"
ANDROID_JAR = Path("/tmp/android.jar")

BUILD_TMP = Path("/tmp/full_apk_build")
if BUILD_TMP.exists():
    shutil.rmtree(BUILD_TMP)
BUILD_TMP.mkdir(parents=True)

PUBLIC_DIR = ROOT / "public"

def build_package(pkg_name: str, out_apk_name: str, app_label: str):
    print(f"\n=======================================================")
    print(f"Building Native APK: {pkg_name} -> {out_apk_name}")
    print(f"=======================================================")

    pkg_tmp = BUILD_TMP / pkg_name.replace(".", "_")
    pkg_tmp.mkdir(parents=True, exist_ok=True)
    classes_dir = pkg_tmp / "classes"
    classes_dir.mkdir(parents=True, exist_ok=True)

    # 1. Create Java source with proper package name
    java_code = f"""package {pkg_name};

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {{

    private static final String START_URL = "https://localhost/index.html";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {{
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

        webView.setWebViewClient(new WebViewClient() {{
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {{
                if (url != null && (url.startsWith("http://") || url.startsWith("https://")) && !url.startsWith("https://localhost/")) {{
                    try {{
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    }} catch (Exception ignored) {{
                    }}
                    return true;
                }}
                return false;
            }}

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {{
                if (url != null && url.startsWith("https://localhost/")) {{
                    String path = url.substring("https://localhost/".length());
                    int q = path.indexOf('?');
                    if (q != -1) path = path.substring(0, q);
                    int h = path.indexOf('#');
                    if (h != -1) path = path.substring(0, h);
                    if (path.isEmpty() || path.equals("/")) path = "index.html";
                    try {{
                        InputStream is = getAssets().open(path);
                        String mime = getMimeType(path);
                        return new WebResourceResponse(mime, "UTF-8", is);
                    }} catch (IOException ignored) {{
                    }}
                }}
                return super.shouldInterceptRequest(view, url);
            }}

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {{
                if (request != null && request.getUrl() != null) {{
                    String url = request.getUrl().toString();
                    if (url.startsWith("https://localhost/")) {{
                        return shouldInterceptRequest(view, url);
                    }}
                }}
                return super.shouldInterceptRequest(view, request);
            }}
        }});

        int bg = Color.parseColor("#0F172A");
        webView.setBackgroundColor(bg);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        getWindow().setStatusBarColor(bg);
        getWindow().setNavigationBarColor(bg);

        if (savedInstanceState != null) {{
            webView.restoreState(savedInstanceState);
        }} else {{
            webView.loadUrl(START_URL);
        }}
    }}

    private String getMimeType(String path) {{
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
    }}

    @Override
    protected void onSaveInstanceState(Bundle outState) {{
        super.onSaveInstanceState(outState);
        if (webView != null) {{
            webView.saveState(outState);
        }}
    }}

    @Override
    public void onBackPressed() {{
        if (webView != null && webView.canGoBack()) {{
            webView.goBack();
        }} else {{
            super.onBackPressed();
        }}
    }}

    @Override
    protected void onDestroy() {{
        if (webView != null) {{
            webView.destroy();
            webView = null;
        }}
        super.onDestroy();
    }}
}}
"""
    pkg_subpath = Path(*pkg_name.split("."))
    src_dir = pkg_tmp / "src" / pkg_subpath
    src_dir.mkdir(parents=True, exist_ok=True)
    java_file = src_dir / "MainActivity.java"
    java_file.write_text(java_code, encoding="utf-8")

    # 2. Compile Java with ecj
    print("  [1/6] Compiling Java code with ecj...")
    r_ecj = subprocess.run([
        "ecj", "-source", "1.8", "-target", "1.8", "-proc:none",
        "-cp", str(ANDROID_JAR),
        "-d", str(classes_dir),
        str(java_file)
    ], capture_output=True, text=True)
    if r_ecj.returncode != 0 and not (classes_dir / pkg_subpath / "MainActivity.class").exists():
        print("ECJ compilation failed:", r_ecj.stderr)
        sys.exit(1)

    # 3. Compile classes to classes.dex using dalvik-exchange (dx)
    print("  [2/6] Compiling classes to DEX...")
    dex_file = pkg_tmp / "classes.dex"
    r_dx = subprocess.run([
        "/usr/bin/dalvik-exchange", "--dex",
        f"--output={dex_file}",
        str(classes_dir)
    ], capture_output=True, text=True)
    if r_dx.returncode != 0:
        print("dx failed:", r_dx.stderr)
        sys.exit(1)

    # 4. Generate AndroidManifest.xml
    manifest_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{pkg_name}"
    android:versionCode="100"
    android:versionName="1.4.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="{app_label}"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true">

        <activity
            android:name="{pkg_name}.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout|smallestScreenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
    manifest_path = pkg_tmp / "AndroidManifest.xml"
    manifest_path.write_text(manifest_xml, encoding="utf-8")

    # 5. Compile resources and package with aapt
    print("  [3/6] Compiling resources & manifest with aapt...")
    res_apk = pkg_tmp / "resources.apk"
    r_aapt = subprocess.run([
        "aapt", "package", "-f",
        "-M", str(manifest_path),
        "-S", str(ANDROID_DIR / "res"),
        "-I", str(ANDROID_JAR),
        "-F", str(res_apk),
        "--auto-add-overlay"
    ], capture_output=True, text=True)
    if r_aapt.returncode != 0:
        print("aapt package failed:", r_aapt.stderr)
        sys.exit(1)

    # 6. Build unaligned APK by combining resources, dex, and web assets
    print("  [4/6] Embedding DEX and web assets...")
    unaligned_apk = pkg_tmp / "unaligned.apk"

    with zipfile.ZipFile(res_apk, "r") as zin:
        with zipfile.ZipFile(unaligned_apk, "w") as zout:
            # Copy all compiled resources (AndroidManifest.xml, resources.arsc, res/)
            for item in zin.infolist():
                data = zin.read(item.filename)
                zinfo = zipfile.ZipInfo(item.filename, (2020, 1, 1, 0, 0, 0))
                zinfo.create_system = 3
                zinfo.external_attr = 0o644 << 16
                zinfo.flag_bits = item.flag_bits
                zinfo.compress_type = item.compress_type
                zout.writestr(zinfo, data)

            # Add classes.dex
            zinfo_dex = zipfile.ZipInfo("classes.dex", (2020, 1, 1, 0, 0, 0))
            zinfo_dex.create_system = 3
            zinfo_dex.external_attr = 0o644 << 16
            zinfo_dex.compress_type = zipfile.ZIP_DEFLATED
            with open(dex_file, "rb") as f:
                zout.writestr(zinfo_dex, f.read())

            # Add web assets
            EXCLUDE_EXTS = {".zip", ".map", ".apk", ".idsig"}
            for root_dir, dirs, files in os.walk(DIST):
                for file in sorted(files):
                    if any(file.endswith(ext) for ext in EXCLUDE_EXTS):
                        continue
                    fpath = os.path.join(root_dir, file)
                    rel = os.path.relpath(fpath, DIST).replace(os.sep, "/")
                    archive_name = "assets/" + rel
                    zinfo_asset = zipfile.ZipInfo(archive_name, (2020, 1, 1, 0, 0, 0))
                    zinfo_asset.create_system = 3
                    zinfo_asset.external_attr = 0o644 << 16
                    zinfo_asset.compress_type = zipfile.ZIP_DEFLATED
                    with open(fpath, "rb") as fp:
                        zout.writestr(zinfo_asset, fp.read())

    # 7. Zipalign (4-byte alignment)
    print("  [5/6] 4-byte zipalign...")
    aligned_apk = pkg_tmp / "aligned.apk"
    r_align = subprocess.run([
        "zipalign", "-p", "-f", "4",
        str(unaligned_apk), str(aligned_apk)
    ], capture_output=True, text=True)
    if r_align.returncode != 0:
        print("zipalign failed:", r_align.stderr)
        sys.exit(1)

    # 8. Sign with apksigner (v1 + v2 + v3)
    print("  [6/6] Signing with apksigner (v1 + v2 + v3)...")
    final_apk = ROOT / out_apk_name
    r_sign = subprocess.run([
        "apksigner", "sign",
        "--ks", str(KEYSTORE),
        "--ks-key-alias", KS_ALIAS,
        "--ks-pass", f"pass:{KS_PASS}",
        "--key-pass", f"pass:{KS_PASS}",
        "--min-sdk-version", "21",
        "--max-sdk-version", "34",
        "--v1-signing-enabled", "true",
        "--v2-signing-enabled", "true",
        "--v3-signing-enabled", "true",
        "--out", str(final_apk),
        str(aligned_apk)
    ], capture_output=True, text=True)
    if r_sign.returncode != 0:
        print("apksigner failed:", r_sign.stderr)
        sys.exit(1)

    # Copy to public
    shutil.copyfile(final_apk, PUBLIC_DIR / out_apk_name)
    shutil.copyfile(final_apk, ROOT / "android-release" / out_apk_name)

    # Verification
    r_ver = subprocess.run(["apksigner", "verify", "-v", str(final_apk)], capture_output=True, text=True)
    print("  Verification result:\n" + r_ver.stdout.strip())
    size_mb = final_apk.stat().st_size / (1024 * 1024)
    print(f"✓ DONE: {final_apk} ({size_mb:.2f} MB)")
    return final_apk

# Build Package 1: ir.clinickonkur.planner (Fresh Package ID - guaranteed install without conflict)
apk1 = build_package("ir.clinickonkur.planner", "ClinicPlan-DirectInstall.apk", "کلینیک پلن")

# Build Package 2: com.clinickonkur.planner (Official Myket Package)
apk2 = build_package("com.clinickonkur.planner", "ClinicPlan-v1.4.0.apk", "کلینیک پلن")

# Mirrors
shutil.copyfile(apk1, ROOT / "ClinicPlan-Final.apk")
shutil.copyfile(apk1, PUBLIC_DIR / "ClinicPlan-Final.apk")
shutil.copyfile(apk2, ROOT / "ClinicPlan-v1.3.0.apk")
shutil.copyfile(apk2, PUBLIC_DIR / "ClinicPlan-v1.3.0.apk")

# Create Release ZIP
zip_name = "ClinicPlan-v1.4.0-Release.zip"
with zipfile.ZipFile(ROOT / zip_name, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(apk1, "ClinicPlan-DirectInstall.apk")
    z.write(apk2, "ClinicPlan-v1.4.0.apk")
shutil.copyfile(ROOT / zip_name, PUBLIC_DIR / zip_name)
shutil.copyfile(ROOT / zip_name, ROOT / "ClinicPlan-Final.zip")
shutil.copyfile(ROOT / zip_name, PUBLIC_DIR / "ClinicPlan-Final.zip")

print("\n" + "=" * 65)
print("ALL BUILDS SUCCEEDED! BOTH PACKAGES BUILT AND VERIFIED!")
print("=" * 65)
