# -*- coding: utf-8 -*-
"""
Generate English versions of store screenshots (1280x800).
Uses the same source captures as the Chinese version, with all text in English.
Output: store-screenshots/en/
"""
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-screenshots" / "en"
SRC_DIR = ROOT / "store-screenshots" / "source-captures"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 800

CAPTURES = [
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-0f90a512-e5c0-4936-9541-edf794d711a5.png"),
        "stored": "capture-main.png",
        "out": "01-main-draw.png",
        "title": "Lightweight Decision Helper",
        "desc": "Popup opens ready to use. Type options, get instant decisions.",
        "feature": "Simple Input",
        "detail": "Real popup UI with rounded inputs & gradient button.",
        "crop": (0, 2, 0, 2),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-6f8900c0-6d04-47b0-86bd-3c4bf434529f.png"),
        "stored": "capture-dice.png",
        "out": "02-dice-animation.png",
        "title": "3D Dice Rolling Animation",
        "desc": "Fun rolling animation adds a touch of ceremony to every decision.",
        "feature": "Dice Decision",
        "detail": "Roll dice for multiple options. Results are crystal clear.",
        "crop": (0, 1, 0, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-121d7b2b-a1d5-4b8f-b3f2-d61df212b700.png"),
        "stored": "capture-coin.png",
        "out": "03-coin-mode.png",
        "title": "Coin Flip — Quick Decision",
        "desc": "Perfect for binary choices. Heads or tails, decided in a flip.",
        "feature": "Coin Mode",
        "detail": "Realistic coin animation from the actual extension.",
        "crop": (0, 0, 4, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-6108b54a-a7c4-42d1-b85e-08961cf27e76.png"),
        "stored": "capture-wheel.png",
        "out": "04-wheel-mode.png",
        "title": "Lucky Wheel Spin",
        "desc": "More fun for multi-option scenarios. Colors match results.",
        "feature": "Wheel Mode",
        "detail": "Real wheel interface from the live extension.",
        "crop": (0, 0, 0, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-e36eb5cd-b3e2-4d12-9563-f2c106cfd9ab.png"),
        "stored": "capture-settings.png",
        "out": "05-settings.png",
        "title": "Clean Settings, i18n Ready",
        "desc": "Modes, language, dark mode — all in a lightweight panel.",
        "feature": "Lightweight Settings",
        "detail": "Small footprint. Minimal layers. Real settings style.",
        "crop": (0, 0, 0, 0),
    },
]


def font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf" if bold else "C:/Windows/Fonts/simsun.ttc",
    ]
    for item in candidates:
        if Path(item).exists():
            return ImageFont.truetype(item, size)
    return ImageFont.load_default()


def draw_text(draw, value, xy, size, color, bold=False):
    draw.text(xy, value, font=font(size, bold), fill=color)


def bg():
    img = Image.new("RGB", (W, H), "#fef6f9").convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse((-220, -150, 430, 360), fill=(196, 122, 176, 38))
    d.ellipse((900, -130, 1420, 320), fill=(242, 160, 181, 52))
    d.ellipse((770, 560, 1400, 940), fill=(124, 111, 190, 30))
    overlay = overlay.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(overlay)
    return img


def paste_capture(canvas, capture):
    source_path = SRC_DIR / capture["stored"]
    if capture["src"].exists():
        copyfile(capture["src"], source_path)
    if not source_path.exists():
        raise FileNotFoundError(f"Missing source capture: {capture['src']}")

    shot = Image.open(source_path).convert("RGBA")
    left, top, right, bottom = capture.get("crop", (0, 0, 0, 0))
    if any((left, top, right, bottom)):
        shot = shot.crop((left, top, shot.width - right, shot.height - bottom))
    max_w, max_h = 610, 540
    scale = min(max_w / shot.width, max_h / shot.height, 1.12)
    new_size = (int(shot.width * scale), int(shot.height * scale))
    shot = shot.resize(new_size, Image.Resampling.LANCZOS)

    x = 660 + (570 - shot.width) // 2
    y = 140 + (560 - shot.height) // 2

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x + 12, y + 16, x + shot.width + 12, y + shot.height + 16), radius=28, fill=(110, 75, 120, 38))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(shot, (x, y))


def make_store_image(capture):
    canvas = bg()
    d = ImageDraw.Draw(canvas)
    draw_text(d, capture["title"], (74, 82), 46, "#4a3860", True)
    draw_text(d, capture["desc"], (78, 148), 25, "#8e7aaa")
    draw_text(d, capture["feature"], (82, 274), 36, "#c47ab0", True)
    draw_text(d, capture["detail"], (86, 336), 22, "#8e7aaa")
    paste_capture(canvas, capture)
    canvas.convert("RGB").save(OUT / capture["out"], "PNG")


for item in CAPTURES:
    make_store_image(item)

print(f"Generated {len(CAPTURES)} English screenshots in {OUT}")
