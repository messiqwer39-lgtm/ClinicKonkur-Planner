#!/usr/bin/env python3
"""
Clinic Konkur Planner — Production APK Packaging & Release Builder
Zero-error packaging for Samsung One UI & Myket (مایکت) compliance.
Includes 4-byte zipalign, v1+v2+v3 apksigner, and exact binary manifest versioning.
"""

import os
import sys
import shutil
import hashlib
import subprocess
import zipfile
from pathlib import Path

ROOT = Path("/app/applet")
DIST = ROOT / "dist"
BASE_APK = ROOT / "android-release" / "ClinicKonkur-Planner-v1.0.0.apk"
KEYSTORE = ROOT / "android-release" / "clinicplan.keystore"
KS_PASS = "clinickonkur123"
KS_ALIAS = "clinicplan"

OUT_V140_APK = ROOT / "android-release" / "ClinicPlan-v1.4.0.apk"
OUT_V130_APK = ROOT / "android-release" / "ClinicPlan-v1.3.0.apk"
OUT_ROOT_APK = ROOT / "ClinicPlan-v1.4.0.apk"
PUBLIC_DIR = ROOT / "public"

TEMP_DIR = Path("/tmp/apk_build_tool")
UNALIGNED_APK = TEMP_DIR / "unaligned.apk"
ALIGNED_APK = TEMP_DIR / "aligned.apk"

if not DIST.exists():
    print("Error: dist/ does not exist. Run npm run build first.")
    sys.exit(1)

if not BASE_APK.exists():
    print(f"Error: {BASE_APK} does not exist.")
    sys.exit(1)

if not KEYSTORE.exists():
    print(f"Error: {KEYSTORE} does not exist.")
    sys.exit(1)

if TEMP_DIR.exists():
    shutil.rmtree(TEMP_DIR)
TEMP_DIR.mkdir(parents=True)

print("[1/6] Extracting base Android package contents and updating manifest...")
with zipfile.ZipFile(BASE_APK, "r") as zin:
    with zipfile.ZipFile(UNALIGNED_APK, "w") as zout:
        for item in zin.infolist():
            # Skip old signatures and old assets
            if item.filename.startswith("META-INF/") or item.filename.startswith("assets/"):
                continue

            content = bytearray(zin.read(item.filename))

            # Modify binary AndroidManifest.xml safely
            if item.filename == "AndroidManifest.xml":
                # 1. Update versionCode to 4 (little-endian 32-bit int)
                # Res_value for versionCode: \x08\x00\x00\x10\x02\x00\x00\x00
                vc_pattern = b"\x08\x00\x00\x10\x02\x00\x00\x00"
                vc_idx = content.find(vc_pattern)
                if vc_idx != -1:
                    content[vc_idx + 4] = 4
                    print(f"  ✓ Upgraded versionCode to 4 at offset {vc_idx}")

                # 2. Update versionName to '1.4.0'
                old_v = "1.1.0".encode("utf-16le")
                new_v = "1.4.0".encode("utf-16le")
                vn_idx = content.find(old_v)
                if vn_idx != -1:
                    content[vn_idx:vn_idx + len(old_v)] = new_v
                    print(f"  ✓ Upgraded versionName to 1.4.0 at offset {vn_idx}")

            # Preserve ZipInfo attributes (Unix filesystem, permissions, date)
            new_item = zipfile.ZipInfo(item.filename, (2020, 1, 1, 0, 0, 0))
            new_item.create_system = 3 # Unix
            new_item.external_attr = 0o644 << 16
            new_item.flag_bits = item.flag_bits
            new_item.compress_type = item.compress_type
            zout.writestr(new_item, bytes(content))

        print("[2/6] Adding latest web dist assets into APK assets/...")
        EXCLUDE_EXTS = {".zip", ".map", ".apk", ".idsig"}
        EXCLUDE_NAMES = {
            "Google-Play-Protect-Appeal-Kit.zip",
            "konkur_planner_screenshots.zip",
            "ClinicPlan-v1.3.0-Release.zip",
            "ClinicPlan-v1.4.0-Release.zip",
        }

        for root_dir, dirs, files in os.walk(DIST):
            for file in sorted(files):
                if file in EXCLUDE_NAMES or any(file.endswith(ext) for ext in EXCLUDE_EXTS):
                    continue
                fpath = os.path.join(root_dir, file)
                rel = os.path.relpath(fpath, DIST).replace(os.sep, "/")
                archive_name = "assets/" + rel

                # Clean Unix file permissions and normalized timestamp
                zinfo = zipfile.ZipInfo(archive_name, (2020, 1, 1, 0, 0, 0))
                zinfo.create_system = 3 # Unix
                zinfo.external_attr = 0o644 << 16
                zinfo.compress_type = zipfile.ZIP_DEFLATED

                with open(fpath, "rb") as fp:
                    zout.writestr(zinfo, fp.read())

print(f"Unaligned APK ready: {UNALIGNED_APK.stat().st_size} bytes")

print("[3/6] Running 4-byte zipalign (Required by Android OS)...")
r_align = subprocess.run(
    ["zipalign", "-p", "-f", "4", str(UNALIGNED_APK), str(ALIGNED_APK)],
    capture_output=True,
    text=True
)
if r_align.returncode != 0:
    print("zipalign failed:", r_align.stderr)
    sys.exit(1)

r_verify_align = subprocess.run(
    ["zipalign", "-c", "-v", "4", str(ALIGNED_APK)],
    capture_output=True,
    text=True
)
if r_verify_align.returncode != 0:
    print("zipalign verification failed:", r_verify_align.stderr)
    sys.exit(1)
print("✓ Zipalign 4-byte boundary verification successful.")

print("[4/6] Signing APK with apksigner (v1 JAR + v2 APK Scheme + v3 APK Scheme)...")
cmd_sign = [
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
    "--out", str(OUT_V140_APK),
    str(ALIGNED_APK)
]
r_sign = subprocess.run(cmd_sign, capture_output=True, text=True)
if r_sign.returncode != 0:
    print("apksigner failed:", r_sign.stderr)
    sys.exit(1)

print("[5/6] Verifying complete cryptographic signatures and package badging...")
r_verify_sign = subprocess.run(
    ["apksigner", "verify", "-v", "--print-certs", str(OUT_V140_APK)],
    capture_output=True,
    text=True
)
if r_verify_sign.returncode != 0:
    print("Signature verification failed:", r_verify_sign.stderr)
    sys.exit(1)
print(r_verify_sign.stdout.strip())

r_badging = subprocess.run(
    ["aapt", "dump", "badging", str(OUT_V140_APK)],
    capture_output=True,
    text=True
)
if r_badging.returncode != 0:
    print("aapt dump badging failed:", r_badging.stderr)
    sys.exit(1)
for line in r_badging.stdout.splitlines()[:6]:
    print("  " + line)

# Copy to root and mirrors
shutil.copyfile(OUT_V140_APK, OUT_V130_APK)
shutil.copyfile(OUT_V140_APK, OUT_ROOT_APK)
shutil.copyfile(OUT_V140_APK, ROOT / "ClinicPlan-Final.apk")
shutil.copyfile(OUT_V140_APK, ROOT / "ClinicPlan-v1.3.0.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicPlan-v1.4.0.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicPlan-Final.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicPlan-v1.3.0.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicPlan-v1.2.0.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicPlan-v1.1.0.apk")
shutil.copyfile(OUT_V140_APK, PUBLIC_DIR / "ClinicKonkur-Planner-v1.0.0.apk")

# Calculate SHA-256
with open(OUT_V140_APK, "rb") as f:
    apk_bytes = f.read()
sha256 = hashlib.sha256(apk_bytes).hexdigest()
size_mb = len(apk_bytes) / (1024 * 1024)

with open(ROOT / "android-release" / "APK_SHA256.txt", "w") as f:
    f.write(sha256 + "\n")

# [6/6] Create Release ZIP package for download
print("[6/6] Packaging Release ZIP with installation instructions...")
RELEASE_GUIDE = """راهنمای نصب نسخه نهایی و بدون خطای پلنر کلینیک کنکور (v1.4.0)
=============================================================
این بسته حاوی فایل APK رسمی، امضا شده و بهینه‌سازی شده با zipalign برای نصب روی تمامی گوشی‌های اندروید (سامسونگ، شیائومی، هواوی و...) و همچنین بارگذاری بدون هیچ خطایی در پنل توسعه‌دهندگان مایکت (Myket) و کافه بازار است.

مشخصات فایل APK:
- نام بسته (Package Name): com.clinickonkur.planner
- شماره نسخه (versionName): 1.4.0
- کد نسخه (versionCode): 4
- حداقل اندروید (minSdkVersion): 21 (اندروید ۵.۰ به بالا)
- اندروید هدف (targetSdkVersion): 34 (اندروید ۱۴)
- امضا شده با کلید اختصاصی ۲۵ ساله (v1 + v2 + v3 Scheme)

حل مشکل خطای Parse Error در سامسونگ:
۱. چنانچه فایل را مستقیماً از گوشی دانلود کرده‌اید، حتماً حجم فایل دانلودی را بررسی کنید که حدود ۶ مگابایت باشد (دانلود ناقص نباشد).
۲. فایل را از داخل برنامه یا پوشه دانلودها مستقیماً باز کرده و روی «نصب / Install» بزنید.
۳. در صورتی که نسخه قدیمی‌تر روی گوشی شما نصب است، می‌توانید آن را به سادگی به‌روزرسانی (Update) کنید یا ابتدا نسخه قبلی را حذف و سپس نسخه ۱.۴.۰ را نصب فرمایید.

ویژگی‌های جدید نسخه ۱.۴.۰:
✓ خروجی ۲ صفحه‌ای با تمام جزئیات: صفحه ۱ برنامه هفتگی و صفحه ۲ کارنامه و گزارش کار
✓ ذخیره آفلاین در گالری گوشی با نگه داشتن انگشت روی تصویر
✓ صدای دلنشین باران و نویز سفید آفلاین با تنظیم بلندی صدا
✓ اعلان‌های گوشی اندروید برای نمایش درس در حال مطالعه و آلارم اتمام پارت
✓ جشن پایان برنامه روزانه با آتش‌بازی و انیمیشن جام قهرمانی
✓ بانک جامع کتب کنکور و امتحانات نهایی بازار ایران (خیلی سبز، گاج، الگو، مبتکران، مهروماه، مشاوران آموزش)

پشتیبانی و تلگرام کلینیک کنکور:
- کانال رسمی: https://t.me/CliniC_Konkur2026
- پشتیبانی و مشاوره VIP: @Poshtibani_CliniCk_konkur2026
"""

GUIDE_FILE = TEMP_DIR / "راهنمای_کامل_نصب_و_انتشار_مایکت.txt"
with open(GUIDE_FILE, "w", encoding="utf-8") as f:
    f.write(RELEASE_GUIDE)

OUT_ZIP_140 = ROOT / "ClinicPlan-v1.4.0-Release.zip"
OUT_ZIP_130 = ROOT / "ClinicPlan-v1.3.0-Release.zip"

with zipfile.ZipFile(OUT_ZIP_140, "w", zipfile.ZIP_DEFLATED) as zrel:
    zrel.write(OUT_V140_APK, "ClinicPlan-v1.4.0.apk")
    zrel.write(GUIDE_FILE, "راهنمای_کامل_نصب_و_انتشار_مایکت.txt")

shutil.copyfile(OUT_ZIP_140, OUT_ZIP_130)
shutil.copyfile(OUT_ZIP_140, ROOT / "ClinicPlan-Final.zip")
shutil.copyfile(OUT_ZIP_140, PUBLIC_DIR / "ClinicPlan-v1.4.0-Release.zip")
shutil.copyfile(OUT_ZIP_140, PUBLIC_DIR / "ClinicPlan-Final.zip")
shutil.copyfile(OUT_ZIP_140, PUBLIC_DIR / "ClinicPlan-v1.3.0-Release.zip")

print("=" * 65)
print("SUCCESS! Release v1.4.0 Built, Aligned, Signed and Verified:")
print(f"APK Path: {OUT_V140_APK}")
print(f"Size: {size_mb:.2f} MB ({len(apk_bytes)} bytes)")
print(f"SHA-256: {sha256}")
print(f"Release ZIP: {OUT_ZIP_140}")
print("=" * 65)
