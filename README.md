# LP Método ODR

Landing page de vendas do **Método ODR — Otimização com Dados Reais**.
HTML/CSS/JS puro, single-page, sem framework e sem build step. Publicada via GitHub Pages.

---

## Estrutura

```
/
├── index.html                  # página inteira (13 seções)
├── assets/
│   ├── css/style.css           # todo o CSS (inclui as @font-face)
│   ├── js/script.js            # UTMs, CTAs, FAQ, sticky bar, eventos
│   ├── fonts/                  # Inter + Space Grotesk (variable, woff2)
│   └── img/
│       ├── logo-odr.png        # logotipo oficial (recorte do MP4 da marca)
│       ├── logo-mark.png       # só o anel "O"
│       ├── favicon-64.png
│       ├── apple-touch-icon.png
│       ├── og-image.png        # 1200×630 para compartilhamento
│       └── imagem-*.png        # PLACEHOLDERS — substituir (ver mapa abaixo)
└── README.md
```

---

## Mapa de imagens

Os `<img>` já apontam para os caminhos abaixo. É só soltar os arquivos em
`assets/img/` com esses nomes exatos — não precisa mexer no HTML.
A numeração segue a do arquivo de copy original.

| Arquivo | Seção | Conteúdo |
|---|---|---|
| `assets/img/imagem-1.png` | 7 — Autoridade | Foto profissional do Eduardo (quadrada, 1:1) |
| `assets/img/imagem-3.png` | 4 — O Método | Dashboard Reset Hormonal (funil completo) |
| `assets/img/imagem-4.png` | 2 — Consciência | Tabela de Ad Sets comparando CAC real |
| `assets/img/imagem-5.png` | 6 — Diferencial | Relatório de IA (Escalar / Otimizar / Cortar / Observar) |
| `assets/img/imagem-7.png` | 6 — Diferencial | Diagnóstico de funil com gargalo identificado |
| `assets/img/imagem-8.png` | 5 — Módulos | Área de membros com os 7 módulos |
| `assets/img/imagem-9.png` | 5 — Módulos | Print de aula real do Módulo 7 |

> ⚠️ **Os `imagem-*.png` que estão no repositório hoje são placeholders** (caixas
> escuras escritas "IMAGEM 4", "IMAGEM 8"…). Estão ali só pra página nunca ficar
> com buraco antes das imagens reais chegarem. Substitua cada um pelo arquivo
> definitivo, mantendo exatamente o mesmo nome.

**Formato recomendado:** os prints de dashboard são recortados em `16/9`
(`object-fit: cover`, alinhado ao topo) — exporte em 1600×900 ou maior para não
perder nitidez. A foto da Seção 7 é recortada em `1:1`.
Nenhuma imagem é distorcida; o corte é sempre proporcional.

Se preferir `.jpg` ou `.webp`, troque a extensão nos `<img>` do `index.html`
(são 7 ocorrências) — o CSS não depende do formato.

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

O logotipo **não foi recriado**. `assets/img/logo-odr.png` é o logotipo
oficial recortado do MP4 da marca (frame 28, o quadro em que ele está mais
próximo da versão estática): nenhum pixel foi repintado — só o fundo do vídeo
foi removido via canal alfa, para o logo assentar em qualquer fundo escuro.
`logo-mark.png` é o mesmo recorte contendo só o anel "O", usado no favicon.

> ⚠️ **Substituir quando houver o arquivo original.** O recorte vem de um vídeo
> comprimido: tem ~622 px de largura e carrega o reflexo animado que passa pelo
> topo do anel. Serve bem no tamanho em que aparece na página, mas o certo é
> trocar por um PNG com transparência ou, melhor ainda, um SVG. Basta
> sobrescrever `assets/img/logo-odr.png` mantendo o nome.

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

## Performance

- Zero dependências de JS. Sem Tailwind CDN, sem jQuery, sem bibliotecas.
  (O Tailwind via CDN custaria ~100 KB de JS bloqueando a renderização — caro
  demais para tráfego 100% mobile de Meta Ads.)
- CSS e JS em arquivo único cada (~19 KB e ~10 KB), servidos com gzip/brotli
  pelo GitHub Pages — o que os deixa em ~5 KB e ~3 KB na rede. Ficaram legíveis
  de propósito: minificar por cima do gzip economizaria menos de 1 KB e tornaria
  a manutenção bem pior.
- **Fontes self-hosted.** Inter e Space Grotesk (variable, woff2) servidas pelo
  próprio domínio — zero conexão com `fonts.googleapis.com`/`gstatic.com`,
  um DNS + handshake a menos no caminho crítico. Só o subset `latin` (~70 KB)
  carrega para leitores em português.
- Imagens com `loading="lazy"`, `decoding="async"`, `width`/`height` e
  `aspect-ratio` fixos — sem layout shift (CLS).
- Nenhuma requisição externa além de GTM e Meta Pixel (que são propositalmente
  as primeiras coisas da página).
- `prefers-reduced-motion` respeitado em todas as animações.

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
