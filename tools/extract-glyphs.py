# Достаёт контуры букв в SVG-пути, чтобы слово бренда рисовалось одинаково в любом
# браузере, независимо от установленных шрифтов.
#   bold / regular  — Menlo (шрифт исходного логотипа, только для сравнения)
#   jb800 / jb400   — JetBrains Mono ExtraBold / Regular (выбранный шрифт слова бренда, OFL)
# Запуск: python tools/extract-glyphs.py assets/glyphs.js   (нужен fonttools)
import json, sys, os
from fontTools.ttLib import TTCollection, TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CHARS = sorted(set("bedwaresoftwareMyBang!BOTRunwaVimperiumNotaWRITEC0DE chat"))

def dump(font):
    gs, cmap, upm = font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm
    glyphs = {}
    for ch in CHARS:
        g = cmap.get(ord(ch))
        if not g:
            continue
        pen = SVGPathPen(gs, ntos=lambda v: str(round(v)))
        gs[g].draw(pen)
        glyphs[ch] = pen.getCommands()
    return {'upm': upm, 'adv': font['hmtx'][cmap[ord('a')]][0], 'glyphs': glyphs}

out = {}
for font in TTCollection('/System/Library/Fonts/Menlo.ttc').fonts:
    name = font['name'].getDebugName(4)
    if name in ('Menlo Bold', 'Menlo Regular'):
        out['bold' if 'Bold' in name else 'regular'] = dump(font)
for key, w in (('jb800', 800), ('jb400', 400)):
    out[key] = dump(TTFont(os.path.join(ROOT, f'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-{w}-normal.woff')))

open(sys.argv[1], 'w').write('/* Сгенерировано tools/extract-glyphs.py: контуры Menlo и JetBrains Mono. */\nwindow.BW_GLYPHS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print({k: (v['upm'], v['adv'], len(v['glyphs'])) for k, v in out.items()})
