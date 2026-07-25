"""
ねこ写真の切り抜きスクリプト。

    cd ver2 && python build/crop-photos.py

img/_src/*.png（元画像）から、サイトで使う img/*.jpg を生成する。
顔の位置がずれたときは HEADS の座標だけ直して、これを流し直せばよい。

必要なもの: Pillow
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(__file__).resolve().parent.parent / 'img' / '_src'
OUT = Path(__file__).resolve().parent.parent / 'img'

# 元画像における顔（耳を含む頭部）の範囲と、正方形の中で頭部が占める割合。
#   (left, top, right, bottom, frac)
#   frac を小さくすると引きに、大きくすると寄りになる。
#   耳が円からはみ出すときは frac を下げる。
HEADS = {
    'cat-kitten': (55, 15, 345, 340, 0.84),   # 首をかしげた子ねこ
    'cat-silver': (58, 35, 322, 315, 0.66),   # シルバータビー（耳が外側にあるので引き気味）
}

TARGET = 480      # 出力する正方形の一辺
FEATHER = 40      # 元画像の縁をぼかす幅（背景の継ぎ目を消す）
BLUR = 30         # 背景に敷くぼかしの強さ
QUALITY = 88


def face_square(name: str, head: tuple[int, int, int, int, float]) -> None:
    """顔を中心にした正方形を作る。元画像が足りない部分は、
    同じ写真をぼかしたもので埋めて、縁を羽根ぼかしでなじませる。"""
    im = Image.open(SRC / f'{name}.png').convert('RGB')
    hx0, hy0, hx1, hy1, frac = head
    scale = TARGET * frac / max(hx1 - hx0, hy1 - hy0)

    w, h = round(im.width * scale), round(im.height * scale)
    front = im.resize((w, h), Image.LANCZOS)
    ox = round(TARGET / 2 - (hx0 + hx1) / 2 * scale)
    oy = round(TARGET / 2 - (hy0 + hy1) / 2 * scale)

    # 背景: 元画像を大きめに拡大してぼかす（色が自然につながる）
    r = max(TARGET / im.width, TARGET / im.height) * 1.6
    bw, bh = round(im.width * r), round(im.height * r)
    back = im.resize((bw, bh), Image.LANCZOS)
    l, t = (bw - TARGET) // 2, (bh - TARGET) // 2
    back = back.crop((l, t, l + TARGET, t + TARGET)).filter(ImageFilter.GaussianBlur(BLUR))

    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rectangle((FEATHER, FEATHER, w - FEATHER, h - FEATHER), fill=255)
    back.paste(front, (ox, oy), mask.filter(ImageFilter.GaussianBlur(FEATHER * 0.55)))

    dst = OUT / f'{name}.jpg'
    back.save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    print(f'{dst.name}  {TARGET}x{TARGET}  scale={scale:.3f}  offset=({ox}, {oy})')


def passthrough(name: str) -> None:
    """切り抜かず、JPEGに変換するだけ（横長の写真バンド用）。"""
    im = Image.open(SRC / f'{name}.png').convert('RGB')
    dst = OUT / f'{name}.jpg'
    im.save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    print(f'{dst.name}  {im.width}x{im.height}')


if __name__ == '__main__':
    for name, head in HEADS.items():
        face_square(name, head)
    passthrough('cat-duo')
