# -*- coding: utf-8 -*-
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-screenshots"
SRC_DIR = OUT / "source-captures"
OUT.mkdir(exist_ok=True)
SRC_DIR.mkdir(exist_ok=True)

W, H = 1280, 800

CAPTURES = [
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-0f90a512-e5c0-4936-9541-edf794d711a5.png"),
        "stored": "capture-main.png",
        "out": "01-main-draw.png",
        "title": "轻量可爱的选择助手",
        "desc": "小弹窗打开就能用，输入选项，马上帮你决定。",
        "feature": "简洁输入",
        "detail": "保留真实弹窗界面、圆角输入框和渐变主按钮。",
        "crop": (0, 2, 0, 2),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-6f8900c0-6d04-47b0-86bd-3c4bf434529f.png"),
        "stored": "capture-dice.png",
        "out": "02-dice-animation.png",
        "title": "保留 3D 摇骰子动画",
        "desc": "选择开始后进入摇骰状态，过程轻巧又有仪式感。",
        "feature": "骰子决策",
        "detail": "多个选项同时摇骰，结果展示更直观。",
        "crop": (0, 1, 0, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-121d7b2b-a1d5-4b8f-b3f2-d61df212b700.png"),
        "stored": "capture-coin.png",
        "out": "03-coin-mode.png",
        "title": "硬币翻转，一抛决定",
        "desc": "适合二选一场景，正反之间快速做选择。",
        "feature": "硬币模式",
        "detail": "保留真实硬币动画截图，不额外绘制替代图形。",
        "crop": (0, 0, 4, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-6108b54a-a7c4-42d1-b85e-08961cf27e76.png"),
        "stored": "capture-wheel.png",
        "out": "04-wheel-mode.png",
        "title": "转盘旋转，结果清楚",
        "desc": "多选项场景更有趣，颜色和结果保持一致。",
        "feature": "转盘模式",
        "detail": "直接使用项目里的转盘界面截图作为展示主体。",
        "crop": (0, 0, 0, 0),
    },
    {
        "src": Path(r"C:\Users\16704\AppData\Local\Temp\codex-clipboard-e36eb5cd-b3e2-4d12-9563-f2c106cfd9ab.png"),
        "stored": "capture-settings.png",
        "out": "05-settings.png",
        "title": "设置简洁，支持中英切换",
        "desc": "玩法、语言、深色模式集中在轻量设置面板里。",
        "feature": "轻量设置",
        "detail": "小尺寸、少层级，保留当前真实设置页样式。",
        "crop": (0, 0, 0, 0),
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
    draw_text(d, capture["detail"], (86, 336), 24, "#8e7aaa")
    paste_capture(canvas, capture)
    canvas.convert("RGB").save(OUT / capture["out"], "PNG")


for item in CAPTURES:
    make_store_image(item)

print(f"Generated {len(CAPTURES)} screenshots in {OUT}")
