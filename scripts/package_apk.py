#!/usr/bin/env python3
import os
import sys
import shutil
import hashlib
import base64
import subprocess
import zipfile
from pathlib import Path

ROOT = Path("/app/applet")
DIST = ROOT / "dist"
BASE_APK_DIR = Path("/tmp/apk_contents")
CERT_PEM = ROOT / "android-release" / "clinic_cert.pem"
KEY_PEM = ROOT / "android-release" / "clinic_key.pem"
OUT_APK = ROOT / "android-release" / "ClinicPlan-v1.3.0.apk"
TEMP_BUILD = Path("/tmp/apk_build_v130")

if not DIST.exists():
    print("Error: dist/ does not exist. Run npm run build first.")
    sys.exit(1)

if not BASE_APK_DIR.exists():
    print("Error: /tmp/apk_contents does not exist.")
    sys.exit(1)

# Clean and prepare temp build directory
if TEMP_BUILD.exists():
    shutil.rmtree(TEMP_BUILD)
TEMP_BUILD.mkdir(parents=True)

# Copy base APK Android files
for item in ["AndroidManifest.xml", "classes.dex", "resources.arsc"]:
    src = BASE_APK_DIR / item
    if src.exists():
        shutil.copy2(src, TEMP_BUILD / item)

if (BASE_APK_DIR / "res").exists():
    shutil.copytree(BASE_APK_DIR / "res", TEMP_BUILD / "res")

# Copy assets from dist/ (exclude zip files and source maps)
assets_dir = TEMP_BUILD / "assets"
assets_dir.mkdir(parents=True)

EXCLUDE_EXTS = {".zip", ".map"}
EXCLUDE_NAMES = {"Google-Play-Protect-Appeal-Kit.zip", "konkur_planner_screenshots.zip"}

for root_dir, dirs, files in os.walk(DIST):
    rel_root = Path(root_dir).relative_to(DIST)
    dest_dir = assets_dir / rel_root
    dest_dir.mkdir(parents=True, exist_ok=True)
    for f in files:
        if f in EXCLUDE_NAMES or any(f.endswith(ext) for ext in EXCLUDE_EXTS):
            continue
        shutil.copy2(Path(root_dir) / f, dest_dir / f)

print(f"Copied {len(list(assets_dir.rglob('*')))} items to assets/")

# Collect all files to be signed (all files in TEMP_BUILD)
files_to_sign = []
for p in sorted(TEMP_BUILD.rglob("*")):
    if p.is_file():
        rel_path = p.relative_to(TEMP_BUILD).as_posix()
        files_to_sign.append((rel_path, p))

# 1. Generate META-INF/MANIFEST.MF
manifest_lines = [
    "Manifest-Version: 1.0",
    "Created-By: 1.0 (ClinicKonkur)",
    ""
]

file_manifest_entries = {}

for rel_path, fpath in files_to_sign:
    with open(fpath, "rb") as f:
        file_bytes = f.read()
    digest = base64.b64encode(hashlib.sha256(file_bytes).digest()).decode("ascii")
    entry_lines = [
        f"Name: {rel_path}",
        f"SHA-256-Digest: {digest}",
        ""
    ]
    file_manifest_entries[rel_path] = "\r\n".join(entry_lines) + "\r\n"
    manifest_lines.extend(entry_lines)

manifest_content = "\r\n".join(manifest_lines) + "\r\n"
manifest_bytes = manifest_content.encode("utf-8")

meta_inf = TEMP_BUILD / "META-INF"
meta_inf.mkdir(exist_ok=True)

with open(meta_inf / "MANIFEST.MF", "wb") as f:
    f.write(manifest_bytes)

# 2. Generate META-INF/CLINICPL.SF
manifest_digest = base64.b64encode(hashlib.sha256(manifest_bytes).digest()).decode("ascii")

sf_lines = [
    "Signature-Version: 1.0",
    "Created-By: 1.0 (ClinicKonkur)",
    f"SHA-256-Digest-Manifest: {manifest_digest}",
    ""
]

for rel_path, entry_str in file_manifest_entries.items():
    entry_bytes = entry_str.encode("utf-8")
    entry_digest = base64.b64encode(hashlib.sha256(entry_bytes).digest()).decode("ascii")
    sf_lines.extend([
        f"Name: {rel_path}",
        f"SHA-256-Digest: {entry_digest}",
        ""
    ])

sf_content = "\r\n".join(sf_lines) + "\r\n"
sf_bytes = sf_content.encode("utf-8")

with open(meta_inf / "CLINICPL.SF", "wb") as f:
    f.write(sf_bytes)

# 3. Sign CLINICPL.SF into CLINICPL.RSA using openssl cms
rsa_path = meta_inf / "CLINICPL.RSA"
cmd = [
    "openssl", "cms", "-sign",
    "-in", str(meta_inf / "CLINICPL.SF"),
    "-out", str(rsa_path),
    "-outform", "DER",
    "-signer", str(CERT_PEM),
    "-inkey", str(KEY_PEM),
    "-nodetach",
    "-nosmimecap"
]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Error signing SF with OpenSSL:", res.stderr)
    sys.exit(1)

print("Generated CLINICPL.RSA signature successfully.")

# 4. Create the final APK (ZIP format)
if OUT_APK.exists():
    OUT_APK.unlink()

# Android requires MANIFEST.MF, CLINICPL.SF, CLINICPL.RSA in META-INF/
with zipfile.ZipFile(OUT_APK, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    # First write META-INF entries
    for m in ["MANIFEST.MF", "CLINICPL.SF", "CLINICPL.RSA"]:
        zf.write(meta_inf / m, f"META-INF/{m}")
    # Write AndroidManifest.xml (uncompressed or deflated)
    zf.write(TEMP_BUILD / "AndroidManifest.xml", "AndroidManifest.xml")
    # Write classes.dex and resources.arsc (uncompressed for resources.arsc is best practice, but deflated works)
    zf.write(TEMP_BUILD / "classes.dex", "classes.dex")
    if (TEMP_BUILD / "resources.arsc").exists():
        zf.write(TEMP_BUILD / "resources.arsc", "resources.arsc")
    # Write res/ and assets/
    for rel_path, fpath in files_to_sign:
        if rel_path in ["AndroidManifest.xml", "classes.dex", "resources.arsc"]:
            continue
        zf.write(fpath, rel_path)

# Copy to public folder too
public_apk = ROOT / "public" / "ClinicPlan-v1.3.0.apk"
shutil.copy2(OUT_APK, public_apk)

# Compute APK SHA-256
with open(OUT_APK, "rb") as f:
    apk_bytes = f.read()
apk_sha256 = hashlib.sha256(apk_bytes).hexdigest()
apk_size_mb = len(apk_bytes) / (1024 * 1024)

print("=" * 60)
print(f"APK created successfully: {OUT_APK}")
print(f"Size: {apk_size_mb:.2f} MB ({len(apk_bytes)} bytes)")
print(f"SHA-256 Hash: {apk_sha256}")
print("=" * 60)

# Write sha256 to a file for easy reading
with open(ROOT / "android-release" / "APK_SHA256.txt", "w") as f:
    f.write(apk_sha256 + "\n")
