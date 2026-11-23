# Постеры логотипа в PNG (2570×1616): слово бренда поверх brand/backdrop.png.
# Те же координаты, что у SVG-постеров в tools/build-logo.mjs. Нужны Pillow и fonttools.
# PNG нужен там, где SVG со вшитой картинкой не принимают (например, в хранилище дизайн-системы).
import os, io, json
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
K = 2  # масштаб
tok = json.load(open(os.path.join(root, 'tokens/tokens.json')))
col = {c['name']: c['value'] for c in tok['color']['tokens']}

def font(weight, size):
    f = TTFont(os.path.join(root, f'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-{weight}-normal.woff'))
    f.flavor = None
    buf = io.BytesIO(); f.save(buf); buf.seek(0)
    return ImageFont.truetype(buf, size)

def word(img, text, weight, size, x, y, rot, fill, stroke=0.05, ls=0.02):
    size, x, y = size * K, x * K, y * K
    f = font(weight, round(size))
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    sw = round(size * stroke / 2)
    for i, ch in enumerate(text):
        d.text((x + i * (0.6 + ls) * size, y), ch, font=f, fill=fill, anchor='ls', stroke_width=sw, stroke_fill=fill)
    layer = layer.rotate(-rot, resample=Image.BICUBIC, center=(x, y))
    img.alpha_composite(layer)

def poster(name, out, size=150, x=318, y=402, second=True):
    bd = Image.open(os.path.join(root, 'brand/backdrop.png')).convert('RGBA')
    img = bd.resize((bd.width * K, bd.height * K), Image.LANCZOS)
    word(img, name, 800, size, x, y, -3.2, col['yellow'])
    word(img, 'WRITE C0DE!', 400, 27, 690, 432, 7, '#ffffff', stroke=0, ls=0)
    if second:
        word(img, 'software', 800, 86, 604, 512, 6.5, col['peach'])
    img.convert('RGB').save(os.path.join(root, 'brand/logo', out), optimize=True)
    print(out, img.size)

poster('bedware', 'bedware-software-poster.png')
poster('Runwa', 'runwa-poster.png', second=False)
poster('Vimperium', 'vimperium-poster.png', size=124, x=300, y=396, second=False)
