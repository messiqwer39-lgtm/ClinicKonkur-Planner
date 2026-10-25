#!/usr/bin/env python3
"""Generate launcher icons (legacy + adaptive foreground) from public/icon.png."""
from PIL import Image
from pathlib import Path

ROOT = Path("/home/z/my-project/work/ClinicKonkur-Planner-main")
SRC = ROOT / "public" / "icon.png"
RES = ROOT / "android" / "res"

src = Image.open(SRC).convert("RGBA")
print("source icon:", src.size)

LEGACY = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
FOREGROUND_DP = 108  # adaptive icon canvas = 108dp
# content safe zone: inner 66% (72/108); use ~58% for nice padding
FG_SCALE = 0.58

for dpi, size in LEGACY.items():
    d = RES / f"mipmap-{dpi}"
    d.mkdir(parents=True, exist_ok=True)
    img = src.resize((size, size), Image.LANCZOS)
    img.save(d / "ic_launcher.png", optimize=True)
    # adaptive foreground canvas
    canvas_size = int(FOREGROUND_DP * size / 48)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    inner = int(canvas_size * FG_SCALE)
    fg = src.resize((inner, inner), Image.LANCZOS)
    off = (canvas_size - inner) // 2
    canvas.paste(fg, (off, off), fg)
    canvas.save(d / "ic_launcher_foreground.png", optimize=True)
    print(f"{dpi}: ic_launcher {size}px, foreground {canvas_size}px")

print("icons done")
