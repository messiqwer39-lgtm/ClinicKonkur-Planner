#!/usr/bin/env python3
"""Prepare android/assets from dist/ for the offline WebView APK."""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
ASSETS = ROOT / "android" / "assets"
FONT_SRC = ROOT / "android" / "tools" / "fonts" / "Vazirmatn.woff2"

# 1. clean & copy
if ASSETS.exists():
    shutil.rmtree(ASSETS)
ASSETS.mkdir(parents=True)

EXCLUDE = {"sw.js", "registerSW.js", "manifest.webmanifest"}
EXCLUDE_EXTS = (".apk", ".zip", ".idsig", ".map")
for item in DIST.iterdir():
    name = item.name
    if name in EXCLUDE or name.startswith("workbox-") or name.lower().endswith(EXCLUDE_EXTS):
        continue
    if item.is_dir():
        shutil.copytree(item, ASSETS / name)
    else:
        shutil.copy2(item, ASSETS / name)

# 2. local Vazirmatn font
fonts_dir = ASSETS / "fonts"
fonts_dir.mkdir(exist_ok=True)
shutil.copy2(FONT_SRC, fonts_dir / "Vazirmatn.woff2")

# 3. index.html surgery
idx = ASSETS / "index.html"
html = idx.read_text(encoding="utf-8")

# remove PWA SW registration script
html = re.sub(r'\s*<script id="vite-plugin-pwa:register-sw"[^>]*></script>', "", html)
# remove manifest links (absolute + relative)
html = re.sub(r'\s*<link rel="manifest"[^>]*>', "", html)
# remove Google Fonts preconnect + stylesheet (offline bundle instead)
html = re.sub(r'\s*<link rel="preconnect"[^>]*>', "", html)
html = re.sub(r'\s*<link href="https://fonts\.googleapis\.com[^"]*"[^>]*>', "", html)

inject = (
    "<style>"
    "@font-face{font-family:'Vazirmatn';"
    "src:url('./fonts/Vazirmatn.woff2') format('woff2-variations');"
    "font-weight:100 900;font-style:normal;font-display:swap;}"
    "</style>"
    "<script>"
    "(function(){"
    "try{localStorage.setItem('__ck_t','1');localStorage.removeItem('__ck_t');}"
    "catch(e){var mem={};var st={getItem:function(k){return Object.prototype.hasOwnProperty.call(mem,k)?mem[k]:null},"
    "setItem:function(k,v){mem[k]=String(v)},removeItem:function(k){delete mem[k]},"
    "clear:function(){mem={}},key:function(i){return Object.keys(mem)[i]||null}};"
    "Object.defineProperty(window,'localStorage',{value:st,configurable:true});}"
    "})();"
    "</script>"
)
html = html.replace("</head>", inject + "</head>")
idx.write_text(html, encoding="utf-8")

# 4. report
total = sum(f.stat().st_size for f in ASSETS.rglob("*") if f.is_file())
print(f"assets ready: {ASSETS}  ({total/1024:.0f} KB)")
for f in sorted(ASSETS.iterdir()):
    print("  -", f.name)
