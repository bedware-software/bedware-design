# Достаёт контуры букв Menlo Bold (шрифт логотипа) в SVG-пути, чтобы слово бренда
# рисовалось одинаково в любом браузере, независимо от установленных шрифтов.
import json, sys
from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen

CHARS = sorted(set("bedwaresoftwareMyBang!BOTRunwaVimperiumNotaWRITEC0DE chat"))
out = {}
for font in TTCollection('/System/Library/Fonts/Menlo.ttc').fonts:
    name = font['name'].getDebugName(4)
    if name not in ('Menlo Bold', 'Menlo Regular'):
        continue
    gs, cmap, upm = font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm
    glyphs = {}
    for ch in CHARS:
        g = cmap.get(ord(ch))
        if not g:
            continue
        pen = SVGPathPen(gs, ntos=lambda v: str(round(v)))
        gs[g].draw(pen)
        glyphs[ch] = pen.getCommands()
    out['bold' if 'Bold' in name else 'regular'] = {'upm': upm, 'adv': font['hmtx'][cmap[ord('a')]][0], 'glyphs': glyphs}
open(sys.argv[1], 'w').write('/* Сгенерировано tools/extract-glyphs.py: контуры Menlo (шрифт логотипа). */\nwindow.BW_GLYPHS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print({k: (v['upm'], v['adv'], len(v['glyphs'])) for k, v in out.items()})
