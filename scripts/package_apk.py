#!/usr/bin/env python3
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

OUT_V130_APK = ROOT / "android-release" / "ClinicPlan-v1.3.0.apk"
OUT_V120_APK = ROOT / "android-release" / "ClinicPlan-v1.2.0.apk"
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

print("[1/5] Extracting base Android package contents...")
with zipfile.ZipFile(BASE_APK, "r") as zin:
    # Prepare unaligned APK without old META-INF and old assets
    with zipfile.ZipFile(UNALIGNED_APK, "w") as zout:
        for item in zin.infolist():
            if item.filename.startswith("META-INF/") or item.filename.startswith("assets/"):
                continue
            
            content = zin.read(item.filename)
            
            # Update versionName in AndroidManifest.xml if present
            if item.filename == "AndroidManifest.xml":
                old_v = "1.1.0".encode("utf-16le")
                new_v = "1.3.0".encode("utf-16le")
                if old_v in content:
                    content = content.replace(old_v, new_v, 1)
            
            new_item = zipfile.ZipInfo(item.filename)
            # CRITICAL: Keep resources.arsc and mipmap images STORED (uncompressed)
            new_item.compress_type = item.compress_type
            zout.writestr(new_item, content)

        print("[2/5] Adding latest web dist assets into APK assets/...")
        EXCLUDE_EXTS = {".zip", ".map", ".apk", ".idsig"}
        EXCLUDE_NAMES = {"Google-Play-Protect-Appeal-Kit.zip", "konkur_planner_screenshots.zip", "ClinicPlan-v1.3.0-Release.zip"}
        
        for root_dir, dirs, files in os.walk(DIST):
            for file in files:
                if file in EXCLUDE_NAMES or any(file.endswith(ext) for ext in EXCLUDE_EXTS):
                    continue
                fpath = os.path.join(root_dir, file)
                rel = os.path.relpath(fpath, DIST).replace(os.sep, "/")
                archive_name = "assets/" + rel
                zout.write(fpath, archive_name, compress_type=zipfile.ZIP_DEFLATED)

print(f"Unaligned APK ready: {UNALIGNED_APK.stat().st_size} bytes")

print("[3/5] Running 4-byte zipalign (Required by Android OS)...")
r_align = subprocess.run(["zipalign", "-p", "-f", "4", str(UNALIGNED_APK), str(ALIGNED_APK)], capture_output=True, text=True)
if r_align.returncode != 0:
    print("zipalign failed:", r_align.stderr)
    sys.exit(1)

r_verify_align = subprocess.run(["zipalign", "-c", "-v", "4", str(ALIGNED_APK)], capture_output=True, text=True)
if r_verify_align.returncode != 0:
    print("zipalign verification failed:", r_verify_align.stderr)
    sys.exit(1)
print("✓ Zipalign verification successful.")

print("[4/5] Signing APK with apksigner (v1 JAR + v2 APK Scheme + v3 APK Scheme)...")
cmd_sign = [
    "apksigner", "sign",
    "--ks", str(KEYSTORE),
    "--ks-key-alias", KS_ALIAS,
    "--ks-pass", f"pass:{KS_PASS}",
    "--key-pass", f"pass:{KS_PASS}",
    "--v1-signing-enabled", "true",
    "--v2-signing-enabled", "true",
    "--v3-signing-enabled", "true",
    "--out", str(OUT_V130_APK),
    str(ALIGNED_APK)
]
r_sign = subprocess.run(cmd_sign, capture_output=True, text=True)
if r_sign.returncode != 0:
    print("apksigner failed:", r_sign.stderr)
    sys.exit(1)

print("[5/5] Verifying complete cryptographic signatures with apksigner...")
r_verify_sign = subprocess.run(["apksigner", "verify", "-v", "--print-certs", str(OUT_V130_APK)], capture_output=True, text=True)
if r_verify_sign.returncode != 0:
    print("Signature verification failed:", r_verify_sign.stderr)
    sys.exit(1)
print(r_verify_sign.stdout.strip())

# Copy to v1.2.0 and public mirrors
shutil.copyfile(OUT_V130_APK, OUT_V120_APK)
shutil.copyfile(OUT_V130_APK, PUBLIC_DIR / "ClinicPlan-v1.3.0.apk")
shutil.copyfile(OUT_V130_APK, PUBLIC_DIR / "ClinicPlan-v1.2.0.apk")
shutil.copyfile(OUT_V130_APK, PUBLIC_DIR / "ClinicPlan-v1.1.0.apk")
shutil.copyfile(OUT_V130_APK, PUBLIC_DIR / "ClinicKonkur-Planner-v1.0.0.apk")

# Calculate SHA-256
with open(OUT_V130_APK, "rb") as f:
    apk_bytes = f.read()
sha256 = hashlib.sha256(apk_bytes).hexdigest()
size_mb = len(apk_bytes) / (1024 * 1024)

with open(ROOT / "android-release" / "APK_SHA256.txt", "w") as f:
    f.write(sha256 + "\n")

print("=" * 60)
print(f"SUCCESS! Signed & Verified APK generated:")
print(f"Path: {OUT_V130_APK}")
print(f"Size: {size_mb:.2f} MB ({len(apk_bytes)} bytes)")
print(f"SHA-256: {sha256}")
print("All public APK links updated.")
print("=" * 60)
