#!/usr/bin/env python3
"""
Regera as variantes AVIF/WebP responsivas a partir dos PNG-fonte em assets/img/.

Uso:
    python3 scripts/build-images.py

Requer Pillow com suporte a AVIF:
    pip install pillow

Cada PNG listado em IMAGES vira N arquivos <nome>-<largura>.avif e
<nome>-<largura>.webp, um por breakpoint em WIDTHS (larguras maiores que a
imagem original são ignoradas). O <picture> do index.html já referencia
esses nomes — não precisa mexer no HTML depois de rodar isto.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, 'assets', 'img')

# arquivo-fonte -> larguras a gerar (px). Os nomes de arquivo carregam a
# largura real (ex.: imagem-4-952.avif) — o <picture> do index.html
# referencia esses números literalmente, então ATUALIZE O HTML se mudar
# uma lista aqui (o script avisa no terminal quando isso acontece).
IMAGES = {
    'imagem-1.png': [320, 480, 640],          # foto de autoridade, 1:1
    'imagem-3.png': [480, 800, 1200, 1568],   # prints 16:9 (ou próximo)
    'imagem-4.png': [480, 800, 952],
    'imagem-5.png': [480, 800, 914],
    'imagem-7.png': [480, 800, 1200, 1568],
    'imagem-8.png': [480, 800, 1200, 1568],
    'imagem-9.png': [480, 800, 1200, 1568],
    'logo-odr.png': [180, 311, 466, 679],     # lockup do header/rodapé
}

WEBP_QUALITY = 78
AVIF_QUALITY = 58


def build(filename, widths):
    src_path = os.path.join(IMG_DIR, filename)
    if not os.path.exists(src_path):
        print(f'  aviso: {filename} não existe, pulando')
        return
    base = os.path.splitext(filename)[0]
    im = Image.open(src_path)
    ow, oh = im.size
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    mode = 'RGBA' if has_alpha else 'RGB'

    # nunca upscala: larguras > a original são cortadas na largura real.
    # dedupe preservando ordem, pra não gravar o mesmo arquivo 2x.
    seen = set()
    effective = []
    for w in widths:
        w = min(w, ow)
        if w not in seen:
            seen.add(w)
            effective.append(w)
    if effective != widths:
        print(f'  aviso: {filename} tem {ow}px de largura — a lista pedida '
              f'{widths} virou {effective}. Se o index.html referenciar as '
              f'larguras antigas no srcset, atualize-o também.')

    for w in effective:
        h = round(oh * w / ow)
        resized = im.convert(mode).resize((w, h), Image.LANCZOS)
        webp_path = os.path.join(IMG_DIR, f'{base}-{w}.webp')
        avif_path = os.path.join(IMG_DIR, f'{base}-{w}.avif')
        resized.save(webp_path, quality=WEBP_QUALITY, method=6)
        resized.save(avif_path, quality=AVIF_QUALITY)
        print(f'  {base}-{w}.webp ({os.path.getsize(webp_path)}b)  '
              f'{base}-{w}.avif ({os.path.getsize(avif_path)}b)')


if __name__ == '__main__':
    for filename, widths in IMAGES.items():
        print(f'{filename}:')
        build(filename, widths)
    print('\nPronto. Os <picture><source srcset=...> do index.html já apontam pra esses nomes.')
