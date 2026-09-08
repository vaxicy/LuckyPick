# -*- coding: utf-8 -*-
"""
Generate LuckyPick store screenshots (1280x800) in zh + en + es.
Sources: store-assets/source-captures/<lang>/capture-*.png
Output:  store-assets/screenshots/<lang>/*.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

from store_texts import CAPTURES

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "store-assets"
SRC_BASE = ASSETS / "source-captures"

W, H = 1280, 800
LANGS = ("zh", "en", "es")

TEXT = "#4a3860"
SUB = "#8e7aaa"
ACCENT = "#c47ab0"

TEXT_MAX_W = 560


def font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf" if bold else "C:/Windows/Fonts/simsun.ttc",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for item in candidates:
        if Path(item).exists():
            return ImageFont.truetype(item, size)
    return ImageFont.load_default()


def wrap_text(draw, value, size, max_width, bold=False):
    f = font(size, bold)
    if " " in value.strip():
        units, sep = value.split(" "), " "
    else:
        units, sep = list(value), ""
    lines, cur = [], ""
    for unit in units:
        trial = (cur + sep + unit) if cur else unit
        if draw.textlength(trial, font=f) <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = unit
    if cur:
        lines.append(cur)
    return lines


def draw_wrapped(draw, value, xy, size, color, max_width, bold=False, line_gap=8):
    x, y = xy
    for line in wrap_text(draw, value, size, max_width, bold):
        draw.text((x, y), line, font=font(size, bold), fill=color)
        y += size + line_gap
    return y


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


def paste_capture(canvas, stored):
    shot = Image.open(stored).convert("RGBA")
    max_w, max_h = 540, 560
    scale = min(max_w / shot.width, max_h / shot.height, 1.05)
    new_size = (int(shot.width * scale), int(shot.height * scale))
    shot = shot.resize(new_size, Image.Resampling.LANCZOS)

    x = 690 + (540 - shot.width) // 2
    y = 120 + (600 - shot.height) // 2

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        (x + 12, y + 16, x + shot.width + 12, y + shot.height + 16),
        radius=28, fill=(110, 75, 120, 38),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(shot, (x, y))


def make_store_image(capture, lang, src, out_dir):
    texts = capture[lang]
    canvas = bg()
    d = ImageDraw.Draw(canvas)
    y = 82
    y = draw_wrapped(d, texts["title"], (74, y), 46, TEXT, TEXT_MAX_W, True) + 22
    y = draw_wrapped(d, texts["desc"], (78, y), 25, SUB, TEXT_MAX_W) + 46
    y = draw_wrapped(d, texts["feature"], (82, y), 36, ACCENT, TEXT_MAX_W, True) + 22
    draw_wrapped(d, texts["detail"], (86, y), 24, SUB, TEXT_MAX_W)
    paste_capture(canvas, src)
    canvas.convert("RGB").save(out_dir / capture["out"], "PNG")


def main():
    for lang in LANGS:
        src_dir = SRC_BASE / lang
        out_dir = ASSETS / "screenshots" / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        if not src_dir.exists():
            print(f"skip {lang}: no captures at {src_dir}")
            continue
        for item in CAPTURES:
            src = src_dir / item["stored"]
            if not src.exists():
                print(f"  [warn] missing {src.name} for {lang}")
                continue
            make_store_image(item, lang, src, out_dir)
        print(f"Generated {lang} screenshots -> {out_dir}")


if __name__ == "__main__":
    main()
