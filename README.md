# LP Método ODR

Landing page de vendas do **Método ODR — Otimização com Dados Reais**.
HTML/CSS/JS puro, single-page, sem framework e sem build step. Publicada via GitHub Pages.

---

## Estrutura

```
/
├── index.html                  # página inteira (13 seções)
├── assets/
│   ├── css/
│   │   ├── style.css           # PRODUÇÃO — minificado, é o que a página carrega
│   │   └── style.src.css       # FONTE — edite este, nunca o minificado direto
│   ├── js/
│   │   ├── script.js           # PRODUÇÃO — minificado
│   │   └── script.src.js       # FONTE
│   ├── fonts/                  # Inter + Space Grotesk (variable, woff2)
│   └── img/
│       ├── logo-odr.png (+ -180/-311/-466/-622.webp/.avif)
│       ├── logo-mark.png       # só o anel "O"
│       ├── favicon-64.png
│       ├── apple-touch-icon.png
│       ├── og-image.png        # 1200×630 para compartilhamento (sem srcset — é só p/ og:image)
│       └── imagem-*.png (+ variantes -Wpx.webp/.avif — larguras variam por imagem)
└── README.md
```

Cada imagem de conteúdo (`logo-odr` e os 7 `imagem-*`) tem variantes AVIF e
WebP em vários tamanhos, entregues via `<picture>` com `<source>` +
fallback `.png`. O navegador escolhe o formato mais leve que suporta e o
tamanho mais próximo do necessário — ver "Build" mais abaixo pra regerar
essas variantes quando trocar um arquivo.

---

## Mapa de imagens

Os `<img>` já apontam para os caminhos abaixo. É só soltar os arquivos em
`assets/img/` com esses nomes exatos — não precisa mexer no HTML.
A numeração segue a do arquivo de copy original.

| Arquivo | Seção | Conteúdo | Nativo |
|---|---|---|---|
| `assets/img/imagem-1.png` | 7 — Autoridade | Foto profissional do Eduardo (1:1) | 640×640 |
| `assets/img/imagem-3.png` | 4 — O Método | Dashboard "Reset Hormonal" (funil completo) | 1568×717 |
| `assets/img/imagem-4.png` | 2 — Consciência | Tabela de Ad Sets — CAC R$291 × R$680 no mesmo conjunto | 952×616 |
| `assets/img/imagem-5.png` | 6 — Diferencial | Relatório de IA (Escalar / Otimizar / Cortar / Observar) | 914×730 |
| `assets/img/imagem-7.png` | 6 — Diferencial | Diagnóstico de funil (nota de saúde + gargalo) | 1568×740 |
| `assets/img/imagem-8.png` | 5 — Módulos | Área de membros com os 7 módulos | 1568×744 |
| `assets/img/imagem-9.png` | 5 — Módulos | Aula real do Módulo 7 (M07A04) | 1568×748 |

Já são as imagens reais do cliente (chegaram via `_uploads/`, ver
`_uploads/LEIA-ME.md` pra saber a origem de cada uma). Cada largura nativa
acima é a maior variante gerada — o script de build nunca faz upscale.

**Formato recomendado:** os prints de dashboard são recortados em `16/9`
(`object-fit: cover`, alinhado ao topo) — exporte em 1600×900 ou maior para não
perder nitidez, com o dado principal (número, gráfico, tabela) centralizado
no terço superior do print, já que é isso que aparece no crop mobile sem
precisar de zoom. A foto da Seção 7 é recortada em `1:1`. Nenhuma imagem é
distorcida; o corte é sempre proporcional (`object-fit:cover`).

**Depois de substituir um PNG, regere as variantes AVIF/WebP** com o script
abaixo (precisa de `Pillow` com suporte a AVIF — `pip install pillow`):

```bash
python3 scripts/build-images.py   # regera todos os -Wpx.avif/.webp a partir dos PNG em assets/img/
```

Se algum print tiver dado sensível de cliente (nome de conta, faturamento,
CNPJ), borre antes de gerar as variantes — a página é pública.

---

## Identidade visual

A paleta foi extraída diretamente do logotipo oficial (amostragem de pixel na
peça de vídeo da marca), e não de uma aproximação:

| Token | Hex | De onde vem | Onde é usado |
|---|---|---|---|
| `--blue` | `#007BFE` | anel do "O" | cor-mãe: atmosfera, kickers, links, módulos |
| `--cyan` | `#22B3F0` | brilho no topo do anel | topo do gradiente do anel e dos números |
| `--green` | `#19D45E` | nó central da linha de tendência | positivos, checklists, "dados reais" |
| `--orange` | `#FF8A21` | nó final da linha de tendência | **CTAs**, escassez, lista de dores |
| `--chrome` | gradiente prata | letras "DR" do logo | wordmark e o preço R$397 |
| `--bg` | `#01050D` | fundo da peça oficial | fundo da página |

**Sobre o briefing original (azul + vermelho):** o logotipo real não tem
vermelho — o acento quente dele é o **laranja** do nó final da linha de
tendência. Os CTAs usam esse laranja, que cumpre o mesmo papel de urgência que
o vermelho cumpriria, com o bônus de ser cor de marca de verdade. O texto do
botão é escuro (`#0A1020`) porque branco sobre laranja não passa em contraste.

O logotipo **não foi recriado**. `assets/img/logo-odr.png` é o arquivo
oficial enviado pelo cliente (`ODR LOGO 7.png`, via `_uploads/`) — cores
completas, fundo transparente, nenhum pixel alterado. Havia mais 4 variantes
do mesmo logo (preto sólido, branco sólido, fundo cinza-chumbo, versão
quadrada); essa foi a escolhida por ser a única com fundo transparente e
paleta completa, combinando com o fundo escuro da página sem tarja.

`logo-mark.png` (usado no favicon/apple-touch-icon) é uma exceção: continua
vindo de um recorte do MP4 da marca, porque nenhum dos arquivos enviados
isola só o anel "O" sem cortar a letra "D" vizinha — as composições enviadas
são todas do lockup completo. Se algum dia sobrar um arquivo com só o mark
(ícone quadrado, sem o "DR"), é só sobrescrever `logo-mark.png`.

O fundo do hero repete dois elementos da peça oficial: a grade de dashboard
(CSS puro) e as linhas de tendência azul e verde subindo (SVG inline).

---

## Comportamento dos CTAs

Os botões usam o atributo `data-cta`:

- **`data-cta="scroll"`** (Seções 1 a 9) — rola suave até a Seção 10 (`#oferta`).
- **`data-cta="checkout"`** (Seções 10, 11, 12, 13 e barra fixa mobile) — vai direto
  para o checkout da Kiwify, já com os parâmetros de origem anexados.

O link do checkout fica em **um único lugar**:
`assets/js/script.js` → `var CHECKOUT_URL = 'https://pay.kiwify.com.br/sl47FEz';`

Para mandar *todos* os botões direto ao checkout, troque `data-cta="scroll"`
por `data-cta="checkout"` no `index.html`.

---

## Repasse de UTMs e dados de lead

No carregamento, o `script.js` lê a query string, guarda em `sessionStorage`
(sobrevive a reload sem parâmetros) e reanexa tudo ao link do checkout.

**Repassados:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `utm_id`, qualquer outro `utm_*`, `src`, `sck`, `fbclid`, `gclid`,
`ttclid`, `ref`.

**Dados de lead** são normalizados para o que a Kiwify entende:

| Vem na URL como | Vira |
|---|---|
| `name`, `nome`, `full_name`, `fullname` | `name` |
| `email`, `e-mail`, `mail` | `email` |
| `phone`, `telefone`, `celular`, `whatsapp`, `tel`, `fone` | `phone` |

Os cookies `_fbp` e `_fbc` também seguem para o checkout como `fbp` e `fbc`.

**Testar:** abra a página com
`?utm_source=facebook&utm_campaign=teste&nome=Joao&email=a@b.com`
e passe o mouse sobre o botão "Garantir Minha Vaga por R$397" — a URL do
checkout já deve mostrar os parâmetros.

---

## Rastreamento

### O que já dispara

| Onde | O quê |
|---|---|
| `<head>`, antes de tudo | GTM `GTM-T9RTDFZ2` |
| `<head>`, logo depois | Meta Pixel `2180723985697542` + `PageView` |
| Início do `<body>` | GTM noscript iframe |
| Clique em CTA de checkout | `InitiateCheckout` (Pixel) + `odr_checkout_click` (dataLayer) |
| Clique em CTA de scroll | `odr_cta_scroll` (dataLayer) |
| Abrir pergunta do FAQ | `odr_faq_open` (dataLayer) |

**Nada de rastreamento usa lazy load.** GTM e Pixel são scripts síncronos no topo
do `<head>`, antes do CSS e das fontes. O lazy load se aplica apenas às imagens
(`loading="lazy"`), e o `script.js` da página carrega com `defer`.

Todo evento do Pixel já é enviado com um **`eventID`** — é ele que permite
deduplicar quando a API de Conversões entrar.

### API de Conversões (ainda não ligada) ⚠️

O token de acesso do Meta **não está neste repositório, e não pode estar**:
GitHub Pages serve arquivos estáticos, então qualquer token no código-fonte fica
público — qualquer pessoa poderia enviar eventos falsos para o seu pixel.

A CAPI precisa de um endpoint server-side. O `script.js` já está pronto para isso:

```js
var CAPI_ENDPOINT = '';  // preencher com a URL do seu endpoint
```

Preenchendo essa constante, a página passa a enviar `PageView` e
`InitiateCheckout` para lá, com o mesmo `eventID` do Pixel (dedup automática).
O payload já vai com `event_name`, `event_id`, `event_source_url`,
`action_source`, `fbp`, `fbc`, `user_data` e `custom_data`.

Opções de endpoint, da mais simples para a mais robusta:

1. **Webhook do Make** — cenário com trigger *Custom Webhook* → módulo HTTP
   POST para `https://graph.facebook.com/v21.0/2180723985697542/events`,
   com o token guardado na conexão do Make. Zero código.
2. **Server-side GTM** — se você já usa GTM, é o caminho mais completo.
3. **Cloudflare Worker / Vercel Function** — token em variável de ambiente.

Em qualquer opção, o endpoint precisa liberar CORS para o domínio da página, e
o hash SHA-256 dos dados pessoais (`em`, `ph`, `fn`) deve ser feito **no
servidor**, nunca aqui.

> **Ação recomendada:** o token que estava no arquivo de copy deve ser
> **revogado e regerado** no Gerenciador de Eventos do Meta antes de ser usado
> em produção — ele circulou em texto puro.

---

## Mobile-first

90%+ do tráfego é Meta Ads mobile, então toda decisão de layout parte do
celular; telas maiores só *recebem mais respiro* via `min-width` media
queries — nunca o contrário. Três coisas concretas:

- **Hero cabe em 375×667 sem rolar.** Título, subtítulo e CTA (as 3 exigências)
  ficam visíveis na primeira tela em qualquer aparelho a partir do iPhone
  SE/8 — testado e medido, não estimado. Abaixo de 480px de largura o
  título usa uma escala de fonte mais compacta (`clamp(1.55rem,7.4vw,2rem)`)
  e o subtítulo cai pra 15px; a partir de 480px volta à escala fluida maior.
  Os badges de prova (7 módulos, garantia) ficam logo abaixo do CTA e podem
  pedir scroll — não fazem parte da exigência de "sem rolagem".
- **Grid de espaçamento em 8pt.** Todo `padding`/`margin` do CSS é múltiplo
  de 8px (tokens `--sp-1` a `--sp-14` em `:root`). As únicas exceções são
  `margin:auto` de centralização (o valor computado depende da largura do
  container, não é um token de espaçamento) — dá pra conferir rodando
  `grep -oE "(padding|margin)[a-z-]*:[^;]+" assets/css/style.src.css` e
  olhando os valores em `px`.
- **Alvo de toque ≥44×44px.** Todo botão tem `min-height` explícito (52px
  padrão, 56–64px nos CTAs grandes, 48px no CTA da barra fixa) — folga
  sobre o mínimo recomendado pela WCAG 2.5.5 e pela iOS HIG.

### Barra fixa de CTA

Some / aparece via `IntersectionObserver` (sem scroll listener, sem jank):
aparece assim que o hero (1º bloco) sai da tela — ou seja, a partir do 2º
bloco em diante — e some de novo só quando a seção de oferta entra na
viewport, pra não empilhar dois CTAs de checkout um em cima do outro.

### Transição entre seções

Cada `<section>` alterna fundo `--bg`/`--bg-alt` e ganha um fio de gradiente
(azul → verde → laranja, as três cores do logotipo) no topo, com um glow
suave logo abaixo — tudo via `::before`/`::after` absolutos, então é
puramente decorativo e não desloca conteúdo (zero CLS). O efeito é notar
"comecei um bloco novo" mesmo rolando rápido no mobile.

---

## Performance

- **Zero dependências de JS.** Sem Tailwind CDN, sem jQuery, sem bibliotecas.
  (O Tailwind via CDN custaria ~100 KB de JS bloqueando a renderização — caro
  demais para tráfego 100% mobile de Meta Ads.)
- **CSS e JS minificados** (`assets/css/style.css` e `assets/js/script.js`
  são os arquivos de produção — gerados a partir de `style.src.css` e
  `script.src.js` via `./scripts/build.sh`, que roda `esbuild --minify`).
  Isso ainda vale mesmo depois do gzip do GitHub Pages: o CSS cai de ~8 KB
  pra ~5 KB e o JS de ~3,6 KB pra ~1,9 KB *pós-gzip* — texto comprime bem,
  mas não ao ponto de anular a limpeza de comentários/espaços que o
  Lighthouse cobra na auditoria de "unminified CSS/JS".
- **Nenhum script bloqueia o carregamento inicial.** GTM e Meta Pixel
  (`<head>`, antes de tudo) usam o snippet oficial assíncrono — eles
  enfileiram e retornam na hora, o `.js` de verdade (`gtm.js`,
  `fbevents.js`) carrega em paralelo sem travar o parser. `script.js` da
  própria página usa `defer`. O único recurso que bloqueia render é o
  `<link rel="stylesheet">` do CSS — de propósito: evita FOUC, e 5 KB
  gzipados não custam LCP perceptível.
- **`font-display:swap`** em todas as 4 `@font-face` — o texto nunca fica
  invisível esperando fonte (sem FOIT), o navegador desenha com a fonte de
  sistema e troca quando o woff2 chega.
- **Fontes self-hosted.** Inter e Space Grotesk (variable, woff2) servidas
  pelo próprio domínio — zero conexão com `fonts.googleapis.com`/`gstatic.com`,
  um DNS + handshake a menos no caminho crítico. Só o subset `latin` (~70 KB)
  carrega para leitores em português.
- **Imagens responsivas em AVIF/WebP com fallback PNG**, servidas via
  `<picture>` + `srcset`/`sizes` — o navegador baixa só o formato mais leve
  que suporta, no tamanho mais próximo do necessário pra tela dele (nada de
  entregar um PNG de 1600px pra um card de 340px no celular). Todas as
  imagens abaixo da dobra usam `loading="lazy"`; a única acima da dobra (o
  logotipo do header) carrega eager com `fetchpriority="high"`.
- `width`/`height` explícitos + `aspect-ratio` no CSS em toda imagem — o
  espaço já é reservado antes do arquivo chegar, então carregar/trocar uma
  imagem não empurra o layout (CLS = 0, medido com
  `PerformanceObserver('layout-shift')` local).
- Nenhuma requisição externa além de GTM e Meta Pixel (que são
  propositalmente as primeiras coisas da página, e são as únicas que *devem*
  disparar cedo — ver "Rastreamento" acima).
- `prefers-reduced-motion` respeitado em todas as animações.

---

## Build

O repositório versiona tanto a fonte (editável) quanto o build de produção
(o que a página realmente carrega) — não há CI de build, então depois de
editar CSS/JS é preciso rodar o script antes de commitar:

```bash
# depois de editar assets/css/style.src.css ou assets/js/script.src.js:
./scripts/build.sh
# depois de trocar um PNG em assets/img/ (logo ou algum imagem-N.png):
python3 scripts/build-images.py
```

`scripts/build.sh` roda `npx esbuild --minify` nos dois arquivos-fonte e
sobrescreve `assets/css/style.css`/`assets/js/script.js` (produção). Sempre
edite os `.src.css`/`.src.js` — nunca os minificados direto, a próxima
build apaga qualquer edição manual neles.

---

## Rodando localmente

```bash
python3 -m http.server 8080
# abre em http://localhost:8080
```

---

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz (`/`).
Não há build — o que está no repositório é exatamente o que vai ao ar.

### Domínio próprio

Para apontar um domínio, crie na raiz um arquivo `CNAME` com uma única linha
contendo o domínio (ex.: `metodoodr.com.br`), e configure o DNS:

- **apex** (`metodoodr.com.br`) → registros `A` para
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **subdomínio** (`lp.metodoodr.com.br`) → `CNAME` para `<usuario>.github.io`

Depois marque *Enforce HTTPS* nas configurações de Pages.
Lembre de atualizar também as URLs absolutas de `og:url`, `og:image` e
`canonical` no `index.html`.
