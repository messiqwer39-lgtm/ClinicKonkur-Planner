# پکج اندروید — کلینیک پلن (نسخه ۲.۰)

این پوشه، پکج بومی اندروید برای اپلیکیشن «کلینیک پلن» است: یک WebView آفلاین و کم‌حجم که نسخه build شده اپ (`dist/`) را از `assets/` داخلی خود اجرا می‌کند — بدون هیچ دسترسی (permission) خطرناک و بدون ترافیک اینترنتی.

## ویژگی‌های امنیتی (مهم برای Google Play Protect)

- **امضای Release** با کلید اختصاصی (RSA 2048، اعتبار ۳۰ سال) — نه کلید debug
- **امضای سه‌گانه**: v1 (JAR) + v2 + v3 — حداکثر سازگاری و امنیت
- **صفر مجوز (Permission)**: اپ کاملاً آفلاین است و فقط لینک‌های خارجی را در مرورگر باز می‌کند
- **بدون ترافیک HTTP رمزنشده** (`usesCleartextTraffic="false"`)
- **minSdk 21 / targetSdk 34** — پشتیبانی از اندروید ۵ تا ۱۵
- حجم نهایی: حدود ۱ مگابایت

## ساختار

```
android/
├── AndroidManifest.xml          # بدون هیچ uses-permission
├── java/ir/clinickonkur/planner/MainActivity.java
├── res/                         # آیکون‌ها، تم، رنگ‌ها
├── assets/                      # خروجی build وب (تولید خودکار — commit نمی‌شود)
├── tools/                       # اسکریپت‌های بیلد
│   ├── prepare_assets.py        # آماده‌سازی assets از dist/
│   ├── make_icons.py            # تولید آیکون‌های launcher
│   └── build_apk.sh             # کامپایل + zipalign + امضا
└── build/                       # خروجی بیلد (commit نمی‌شود)
```

## مراحل بازسازی APK

```bash
# ۱) بیلد وب‌اپ
bun install && bun run build

# ۲) آماده‌سازی assets اندروید
python3 tools/prepare_assets.py

# ۳) تولید آیکون‌ها
python3 tools/make_icons.py

# ۴) بیلد و امضای APK
#    نیازمندی‌ها: build-tools 34 (aapt2, d8, zipalign, apksigner)،
#    android.jar (پلتفرم 34/35)، JDK یا Eclipse ecj
bash tools/build_apk.sh
```

## هشدار کلید امضا (مهم‌ترین بخش!)

کلید امضای Release در مسیر `android-release/clinicplan-final.keystore` نگهداری می‌شود:

- alias: `clinicplan`
- store/key password: `clinickonkur2026`
- SHA-256: `6E:25:D3:3D:C1:F2:6D:0F:DB:32:3A:57:FF:D5:B3:58:55:F9:1A:28:32:6A:E3:EC:61:DD:40:57:56:EA:F5:D8`

**همه به‌روزرسانی‌های بعدی باید با همین کلید امضا شوند و `versionCode` همیشه بالاتر از نسخه قبلی باشد.** اگر کلید عوض شود یا versionCode کمتر شود، کاربرانی که نسخه قبلی را نصب دارند هنگام به‌روزرسانی پیام «App not installed» می‌گیرند. (دقیقاً همین اتفاق برای نسخه‌های قبلی افتاد: versionCode به ۲ برگشته بود و کلید امضا عوض شده بود.)
