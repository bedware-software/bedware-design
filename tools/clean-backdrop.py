# Подложка логотипа: inputs/logo-empty.png без надписи «WRITE C0DE!»
# (надпись в логотипе теперь набирается шрифтом бренда поверх). Нужен Pillow.
import os
from PIL import Image, ImageDraw
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
im = Image.open(os.path.join(root, 'inputs/logo-empty.png')).convert('RGB')
# Надпись лежит на чистом чёрном, наклон около 7°: закрываем её чёрным четырёхугольником.
ImageDraw.Draw(im).polygon([(672, 392), (868, 418), (862, 468), (666, 440)], fill=(0, 0, 0))
os.makedirs(os.path.join(root, 'brand'), exist_ok=True)
im.save(os.path.join(root, 'brand/backdrop.png'), optimize=True)
print(im.size)
