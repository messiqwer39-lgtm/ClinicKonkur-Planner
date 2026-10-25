#!/usr/bin/env bash
# Build & sign the ClinicKonkur Planner offline WebView APK (no gradle needed).
set -euo pipefail

PROJ=/home/z/my-project/work/ClinicKonkur-Planner-main
SDK=/home/z/my-project/work/android-sdk
BT=$SDK/bt/android-14
AJ=$SDK/android-35/android.jar
ECJ=$SDK/ecj.jar

OUT=$PROJ/android/build
KEYSTORE_DIR=/home/z/my-project/download/keystore
KEYSTORE=$KEYSTORE_DIR/clinickonkur-release.keystore
KS_PASS_FILE=$KEYSTORE_DIR/keystore-info.txt
APK_NAME=ClinicKonkur-Planner-v2.0.apk

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

echo "[3/6] compiling Java (ecj)..."
java -jar "$ECJ" -source 1.8 -target 1.8 \
  -bootclasspath "$AJ" -cp "$AJ" \
  -encoding UTF-8 -nowarn \
  -d "$OUT/classes" \
  java/ir/clinickonkur/planner/MainActivity.java 2>&1 | grep -v "^$" || true
test -f "$OUT/classes/ir/clinickonkur/planner/MainActivity.class"

echo "[4/6] dexing (d8)..."
java -cp "$BT/lib/d8.jar" com.android.tools.r8.D8 \
  --release --lib "$AJ" --min-api 21 \
  --output "$OUT/dex" \
  $(find "$OUT/classes" -name '*.class')
(cd "$OUT/dex" && zip -q -uX "$OUT/unsigned.apk" classes.dex)

echo "[5/6] zipalign..."
"$BT/zipalign" -f 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

echo "[6/6] signing..."
if [ ! -f "$KEYSTORE" ]; then
  mkdir -p "$KEYSTORE_DIR"
  KS_PASS=$(openssl rand -hex 12)
  keytool -genkeypair -v -keystore "$KEYSTORE" -alias clinickonkur \
    -keyalg RSA -keysize 2048 -validity 10950 \
    -storepass "$KS_PASS" -keypass "$KS_PASS" \
    -dname "CN=Clinic Konkur Planner, OU=Mobile, O=ClinicKonkur, L=Tehran, C=IR" >/dev/null 2>&1
  cat > "$KS_PASS_FILE" <<EOF
# KEEP THIS FILE SAFE — needed to sign future updates of the app
# Do NOT share publicly (anyone holding it can sign updates with your key)
keystore file : $KEYSTORE
alias         : clinickonkur
store password: $KS_PASS
key password  : $KS_PASS
EOF
  chmod 600 "$KS_PASS_FILE"
fi
KS_PASS=$(grep 'store password' "$KS_PASS_FILE" | awk '{print $NF}')

java -jar "$BT/lib/apksigner.jar" sign \
  --ks "$KEYSTORE" --ks-key-alias clinickonkur \
  --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --out "$OUT/$APK_NAME" "$OUT/aligned.apk"

echo "== verify =="
java -jar "$BT/lib/apksigner.jar" verify --print-certs "$OUT/$APK_NAME"
echo "== badging =="
"$BT/aapt2" dump badging "$OUT/$APK_NAME" | grep -E "^package|^application-label|sdkVersion|targetSdkVersion|uses-permission" || true
echo "== result =="
ls -la "$OUT/$APK_NAME"
cp "$OUT/$APK_NAME" /home/z/my-project/download/
echo "copied to /home/z/my-project/download/$APK_NAME"
