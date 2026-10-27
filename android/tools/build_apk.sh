#!/usr/bin/env bash
# Build & sign the ClinicKonkur Planner offline WebView APK (no gradle needed).
#
# Requirements: build-tools 34 (aapt2, d8, zipalign, apksigner), android.jar
# (platform 34/35), a JRE + ecj.jar (or a JDK with javac), python3.
#
# Environment overrides:
#   BT       path to build-tools dir (default: /home/z/my-project/android-tools/android-14)
#   AJ       path to android.jar    (default: /home/z/my-project/android-tools/platform/android-34/android.jar)
#   ECJ_JAR  path to ecj.jar        (default: /home/z/my-project/appwork/ecj.jar)
#
# The release keystore lives at android-release/clinicplan-final.keystore
# (alias: clinicplan, password: clinickonkur2026). ALWAYS sign updates with
# this same key, or users will get "App not installed" on update.
set -euo pipefail

PROJ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BT="${BT:-/home/z/my-project/android-tools/android-14}"
AJ="${AJ:-/home/z/my-project/android-tools/platform/android-34/android.jar}"
ECJ_JAR="${ECJ_JAR:-/home/z/my-project/appwork/ecj.jar}"

PKG="ir.clinickonkur.plannerapp"
PKG_PATH="ir/clinickonkur/plannerapp"
APK_NAME="ClinicPlan-v2.1.0.apk"

OUT="$PROJ/android/build"
KEYSTORE="$PROJ/android-release/clinicplan-final.keystore"
KS_ALIAS="clinicplan"
KS_PASS="clinickonkur2026"

if [ ! -d "$BT" ]; then echo "ERROR: build-tools not found at $BT (set BT=...)"; exit 1; fi
if [ ! -f "$AJ" ]; then echo "ERROR: android.jar not found at $AJ (set AJ=...)"; exit 1; fi
if [ ! -f "$PROJ/android/assets/index.html" ]; then
  echo "ERROR: android/assets is empty. Run: python3 android/tools/prepare_assets.py"; exit 1
fi
if [ ! -f "$KEYSTORE" ]; then echo "ERROR: keystore missing at $KEYSTORE"; exit 1; fi

rm -rf "$OUT"
mkdir -p "$OUT/classes" "$OUT/dex" "$OUT/gen"

cd "$PROJ/android"

echo "[1/6] aapt2 compile resources..."
"$BT/aapt2" compile --dir res -o "$OUT/res.zip"

echo "[2/6] aapt2 link + package assets..."
"$BT/aapt2" link -o "$OUT/unsigned.apk" \
  -I "$AJ" \
  --manifest AndroidManifest.xml \
  -A assets \
  --java "$OUT/gen" \
  --auto-add-overlay \
  "$OUT/res.zip"

echo "[3/6] compiling Java..."
FOUND_CLASS=0
if command -v javac >/dev/null 2>&1; then
  javac -source 1.8 -target 1.8 -nowarn \
    -bootclasspath "$AJ" -cp "$AJ" \
    -encoding UTF-8 -d "$OUT/classes" \
    "java/$PKG_PATH/MainActivity.java" 2>/dev/null || \
  javac -source 1.8 -target 1.8 -nowarn \
    -cp "$AJ" -encoding UTF-8 -d "$OUT/classes" \
    "java/$PKG_PATH/MainActivity.java"
  FOUND_CLASS=1
elif [ -f "$ECJ_JAR" ]; then
  java -jar "$ECJ_JAR" -source 1.8 -target 1.8 \
    -bootclasspath "$AJ" -cp "$AJ" \
    -encoding UTF-8 -nowarn -proc:none \
    -d "$OUT/classes" \
    "java/$PKG_PATH/MainActivity.java" 2>&1 | grep -v "^$" || true
  FOUND_CLASS=1
fi
[ "$FOUND_CLASS" = "1" ] || { echo "ERROR: no Java compiler available (javac or ecj.jar)"; exit 1; }
test -f "$OUT/classes/$PKG_PATH/MainActivity.class"

echo "[4/6] dexing (d8)..."
java -cp "$BT/lib/d8.jar" com.android.tools.r8.D8 \
  --release --lib "$AJ" --min-api 21 \
  --output "$OUT/dex" \
  $(find "$OUT/classes" -name '*.class')
(cd "$OUT/dex" && zip -q -uX "$OUT/unsigned.apk" classes.dex)

echo "[5/6] zipalign..."
"$BT/zipalign" -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

echo "[6/6] signing (v1 + v2 + v3)..."
java -jar "$BT/lib/apksigner.jar" sign \
  --ks "$KEYSTORE" --ks-key-alias "$KS_ALIAS" \
  --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --min-sdk-version 21 --max-sdk-version 34 \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$OUT/$APK_NAME" "$OUT/aligned.apk"

echo "== verify =="
java -jar "$BT/lib/apksigner.jar" verify --print-certs "$OUT/$APK_NAME"
"$BT/zipalign" -c 4 "$OUT/$APK_NAME" && echo "zipalign: OK"
echo "== badging =="
"$BT/aapt2" dump badging "$OUT/$APK_NAME" | grep -E "^package|^application-label|launchable-activity|sdkVersion|targetSdkVersion" || true
echo "== result =="
ls -la "$OUT/$APK_NAME"
mkdir -p "$PROJ/android-release"
cp "$OUT/$APK_NAME" "$PROJ/android-release/$APK_NAME"
echo "copied to android-release/$APK_NAME"
