#!/usr/bin/env bash
# Rebuild de produção: minifica CSS e JS a partir dos arquivos-fonte.
# Rode depois de editar assets/css/style.src.css ou assets/js/script.src.js.
#
# Uso:
#   ./scripts/build.sh
#
# Requer Node (usa `npx esbuild` — baixa o esbuild na primeira vez, sem
# precisar instalar nada permanentemente ou versionar node_modules/).
set -euo pipefail
cd "$(dirname "$0")/.."

npx --yes esbuild assets/css/style.src.css --minify --outfile=assets/css/style.css
npx --yes esbuild assets/js/script.src.js  --minify --outfile=assets/js/script.js

echo "OK — assets/css/style.css e assets/js/script.js atualizados."
echo "Para as imagens (depois de trocar um PNG em assets/img/): python3 scripts/build-images.py"
