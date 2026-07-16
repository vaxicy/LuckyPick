# -*- coding: utf-8 -*-
"""
Generate bilingual (Chinese + English) promo tiles for Chrome Web Store.
Small: 440x280, Marquee: 1400x560
Each image contains both languages so Chrome store detects it as multilingual.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-screenshots"
SRC = OUT / "source-captures"
OUT.mkdir(exist_ok=True)

TEXT = "#4a3860"
SUB = "#8e7aaa"
ACCENT = "#c47ab0"
ACCENT2 = "#f2a0b5"
BG = "#fef6f9"


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


def text(draw, value, xy, size, color=TEXT, bold=False):
    draw.text(xy, value, font=font(size, bold), fill=color)


def rr(draw, box, r, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def bg(size):
    w, h = size
    img = Image.new("RGBA", size, BG)
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((-w * .18, -h * .36, w * .46, h * .74), fill=(196, 122, 176, 42))
    d.ellipse((w * .64, -h * .40, w * 1.18, h * .72), fill=(242, 160, 181, 58))
    d.ellipse((w * .50, h * .66, w * 1.08, h * 1.28), fill=(124, 111, 190, 32))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(max(10, w // 55))))
    return img


def load_capture(name):
    path = SRC / name
    if not path.exists():
        raise FileNotFoundError(f"Missing source capture: {path}")
    return Image.open(path).convert("RGBA")


def shadow_paste(canvas, shot, xy, radius=28):
    x, y = xy
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        (x + 10, y + 14, x + shot.width + 10, x + shot.height + 14),
        radius=radius,
        fill=(110, 75, 120, 38),
    )
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(16)))
    canvas.alpha_composite(shot, (x, y))


def fit(img, max_w, max_h):
    scale = min(max_w / img.width, max_h / img.height)
    return img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)


def make_small_bilingual():
    """Small promo tile 440x280 with bilingual text."""
    canvas = bg((440, 280))
    d = ImageDraw.Draw(canvas)

    # Brand title
    text(d, "Lucky Pick", (28, 28), 30, ACCENT, True)
    # Bilingual subtitle — Chinese first line, English second
    text(d, "别纠结了，摇一下就决定", (28, 68), 13, SUB)       # Chinese
    text(d, "Stop overthinking. Just roll!", (28, 88), 12, SUB)  # English
    # Bilingual tagline
    text(d, "轻量选择助手", (28, 116), 15, TEXT, True)          # Chinese
    text(d, "Lightweight Decision Helper", (28, 140), 12, SUB)   # English

    # Popup screenshot
    shot = load_capture("capture-main.png").crop((0, 2, 604, 467))
    shot = fit(shot, 200, 156)
    shadow_paste(canvas, shot, (210, 58), 20)

    # CTA button with bilingual label
    rr(d, (28, 198, 162, 242), 16, ACCENT)
    # Chinese primary, English secondary
    text(d, "轻量小弹窗", (44, 207), 14, "#ffffff", True)
    text(d, "Lightweight Popup", (44, 226), 10, "#ffffff")

    canvas.convert("RGB").save(OUT / "promo-small-440x280.png", "PNG")
    print("  -> promo-small-440x280.png (bilingual)")


def make_marquee_bilingual():
    """Marquee promo tile 1400x560 with bilingual text."""
    canvas = bg((1400, 560))
    d = ImageDraw.Draw(canvas)

    # Brand title
    text(d, "Lucky Pick", (82, 78), 56, ACCENT, True)

    # Bilingual subtitle — Chinese main, English sub
    text(d, "轻量可爱的选择助手", (86, 160), 32, TEXT, True)     # Chinese
    text(d, "Lightweight & Cute Decision Helper", (88, 204), 22, SUB)  # English

    # Bilingual description
    text(d, "输入选项，让选择变得轻松又有趣。", (88, 250), 21, SUB)       # Chinese
    text(d, "Type options and make decisions fun & easy.", (88, 278), 19, SUB)  # English

    # CTA buttons — bilingual, centered vertically in 50px-tall buttons
    btn_h = 50
    btn_y = 330
    btn_center_y = btn_y + btn_h // 2

    rr(d, (92, btn_y, 276, btn_y + btn_h), 22, ACCENT)
    # Center: CN line above EN line, both centered within button height
    text(d, "打开就能用", (124, btn_center_y - 16), 17, "#ffffff", True)
    text(d, "Ready to Use", (132, btn_center_y + 4), 13, "#ffffff")

    rr(d, (296, btn_y, 506, btn_y + btn_h), 22, "#ffffff", ACCENT2, 2)
    text(d, "轻量 · 可爱 · 有趣", (320, btn_center_y - 15), 16, ACCENT, True)
    text(d, "Lightweight · Cute · Fun", (322, btn_center_y + 5), 13, ACCENT)

    # Popup screenshots (stacked, same as original layout)
    dice = fit(load_capture("capture-dice.png").crop((0, 1, 598, 424)), 430, 306)
    main = fit(load_capture("capture-main.png").crop((0, 2, 604, 467)), 468, 364)
    settings = fit(load_capture("capture-settings.png"), 396, 300)

    shadow_paste(canvas, dice, (780, 64), 22)
    shadow_paste(canvas, main, (630, 142), 22)
    shadow_paste(canvas, settings, (930, 240), 22)

    canvas.convert("RGB").save(OUT / "promo-marquee-1400x560.png", "PNG")
    print("  -> promo-marquee-1400x560.png (bilingual)")


if __name__ == "__main__":
    print("Generating bilingual promo tiles...")
    make_small_bilingual()
    make_marquee_bilingual()
    print("Done! All bilingual promo tiles generated.")
