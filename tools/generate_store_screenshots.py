# -*- coding: utf-8 -*-
"""
Generate LuckyPick store screenshots (1280x800) in zh + en.
Sources: store-assets/source-captures/*.png
Output:  store-assets/screenshots/zh/*.png, store-assets/screenshots/en/*.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "store-assets"
SRC_DIR = ASSETS / "source-captures"

W, H = 1280, 800

TEXT = "#4a3860"
SUB = "#8e7aaa"
ACCENT = "#c47ab0"

CAPTURES = [
    {
        "stored": "capture-main.png",
        "out": "01-main-draw.png",
        "zh": {
            "title": "轻量可爱的选择助手",
            "desc": "小弹窗打开就能用，输入选项，马上帮你决定。",
            "feature": "简洁输入",
            "detail": "保留真实弹窗界面、圆角输入框和渐变主按钮。",
        },
        "en": {
            "title": "Lightweight Decision Helper",
            "desc": "Popup opens ready to use. Type options, get instant decisions.",
            "feature": "Simple Input",
            "detail": "Real popup UI with rounded inputs & gradient button.",
        },
    },
    {
        "stored": "capture-dice.png",
        "out": "02-dice-animation.png",
        "zh": {
            "title": "保留 3D 摇骰子动画",
            "desc": "选择开始后进入摇骰状态，过程轻巧又有仪式感。",
            "feature": "骰子决策",
            "detail": "多个选项同时摇骰，结果展示更直观。",
        },
        "en": {
            "title": "3D Dice Rolling Animation",
            "desc": "Fun rolling animation adds ceremony to every decision.",
            "feature": "Dice Decision",
            "detail": "Roll dice for multiple options. Results are crystal clear.",
        },
    },
    {
        "stored": "capture-coin.png",
        "out": "03-coin-mode.png",
        "zh": {
            "title": "硬币翻转，一抛决定",
            "desc": "适合二选一场景，正反之间快速做选择。",
            "feature": "硬币模式",
            "detail": "真实硬币动画，二选一的最佳拍档。",
        },
        "en": {
            "title": "Coin Flip — Quick Decision",
            "desc": "Perfect for binary choices. Heads or tails, decided in a flip.",
            "feature": "Coin Mode",
            "detail": "Realistic coin animation from the actual extension.",
        },
    },
    {
        "stored": "capture-wheel.png",
        "out": "04-wheel-mode.png",
        "zh": {
            "title": "转盘旋转，结果清楚",
            "desc": "多选项场景更有趣，颜色和结果保持一致。",
            "feature": "转盘模式",
            "detail": "幸运转盘华丽旋转，决策过程充满仪式感。",
        },
        "en": {
            "title": "Lucky Wheel Spin",
            "desc": "More fun for multi-option scenarios. Colors match results.",
            "feature": "Wheel Mode",
            "detail": "Real wheel interface from the live extension.",
        },
    },
    {
        "stored": "capture-rps-battle.png",
        "out": "05-rps-mode.png",
        "zh": {
            "title": "猜拳对决，谁赢选谁",
            "desc": "电脑代表 A，你代表 B，赢家的选项直接选中。",
            "feature": "猜拳模式",
            "detail": "出拳动画 + 平局自动重赛，公平又有趣。",
        },
        "en": {
            "title": "Rock-Paper-Scissors Duel",
            "desc": "Bot plays A, you play B — the winning side gets picked.",
            "feature": "RPS Mode",
            "detail": "Shake animation with auto re-throw on ties.",
        },
    },
    {
        "stored": "capture-settings.png",
        "out": "06-settings.png",
        "zh": {
            "title": "设置简洁，支持中英西三语",
            "desc": "玩法、语言、深色模式集中在轻量设置面板里。",
            "feature": "三语界面",
            "detail": "中文 / English / Español 一键切换。",
        },
        "en": {
            "title": "Clean Settings, 3 Languages",
            "desc": "Modes, language, dark mode — all in a lightweight panel.",
            "feature": "i18n Ready",
            "detail": "中文 / English / Español, one tap away.",
        },
    },
]


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


def paste_capture(canvas, stored):
    shot = Image.open(SRC_DIR / stored).convert("RGBA")
    max_w, max_h = 610, 560
    scale = min(max_w / shot.width, max_h / shot.height, 1.12)
    new_size = (int(shot.width * scale), int(shot.height * scale))
    shot = shot.resize(new_size, Image.Resampling.LANCZOS)

    x = 660 + (570 - shot.width) // 2
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


def make_store_image(capture, lang, out_dir):
    texts = capture[lang]
    canvas = bg()
    d = ImageDraw.Draw(canvas)
    draw_text(d, texts["title"], (74, 82), 46, TEXT, True)
    draw_text(d, texts["desc"], (78, 148), 25, SUB)
    draw_text(d, texts["feature"], (82, 274), 36, ACCENT, True)
    draw_text(d, texts["detail"], (86, 336), 24, SUB)
    paste_capture(canvas, capture["stored"])
    canvas.convert("RGB").save(out_dir / capture["out"], "PNG")


def main():
    for lang in ("zh", "en"):
        out_dir = ASSETS / "screenshots" / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        for item in CAPTURES:
            make_store_image(item, lang, out_dir)
        print(f"Generated {len(CAPTURES)} {lang} screenshots -> {out_dir}")


if __name__ == "__main__":
    main()
