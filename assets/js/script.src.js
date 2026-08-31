/* ==========================================================================
   MÉTODO ODR — script da landing page
   1) Repasse de UTMs / dados de lead para o checkout
   2) CTAs (scroll suave ou checkout)
   3) FAQ accordion
   4) Barra fixa de CTA no mobile
   5) Eventos de rastreamento (dataLayer + Meta Pixel, com eventID p/ CAPI)

   IMPORTANTE: nada aqui é lazy load de pixel. Pixel e GTM já dispararam
   no <head>. Este arquivo só adiciona eventos de interação.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     CONFIGURAÇÃO — único lugar a editar
     TODO: trocar pelo link do checkout Kiwify definitivo, se mudar.
     ---------------------------------------------------------------------- */
  var CHECKOUT_URL = 'https://pay.kiwify.com.br/sl47FEz';

  /* Endpoint da API de Conversões (server-side).
     Deixe vazio enquanto não existir um endpoint próprio.
     NUNCA coloque o access token do Meta aqui — este arquivo é público.
     Veja README.md → "API de Conversões". */
  var CAPI_ENDPOINT = '';

  var STORAGE_KEY = 'odr_params';

  /* Parâmetros repassados ao checkout, na ordem de prioridade. */
  var PASSTHROUGH = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
    'src', 'sck', 'fbclid', 'gclid', 'ttclid', 'ref'
  ];

  /* Aliases de dados pessoais → nome do parâmetro que a Kiwify entende. */
  var LEAD_ALIASES = {
    name: 'name', nome: 'name', full_name: 'name', fullname: 'name',
    email: 'email', 'e-mail': 'email', mail: 'email',
    phone: 'phone', telefone: 'phone', celular: 'phone', whatsapp: 'phone',
    tel: 'phone', fone: 'phone'
  };

  /* ======================================================================
     1) CAPTURA E PERSISTÊNCIA DOS PARÂMETROS
     ====================================================================== */
  function readStore() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (e) { return {}; }
  }

  function writeStore(obj) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  /* Lê a URL atual, normaliza aliases e mescla com o que já estava guardado.
     A URL atual sempre vence — clique novo de anúncio sobrescreve o anterior. */
  function collectParams() {
    var stored = readStore();
    var search = new URLSearchParams(window.location.search);
    var out = {};
    var k;

    for (k in stored) {
      if (Object.prototype.hasOwnProperty.call(stored, k)) out[k] = stored[k];
    }

    search.forEach(function (value, key) {
      if (!value) return;
      var lower = key.toLowerCase();

      if (PASSTHROUGH.indexOf(lower) !== -1) {
        out[lower] = value;
        return;
      }
      if (Object.prototype.hasOwnProperty.call(LEAD_ALIASES, lower)) {
        out[LEAD_ALIASES[lower]] = value;
        return;
      }
      /* qualquer utm_* fora da lista também segue adiante */
      if (lower.indexOf('utm_') === 0) out[lower] = value;
    });

    writeStore(out);
    return out;
  }

  /* Cookies do Meta: melhoram a atribuição no checkout. */
  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : '';
  }

  var PARAMS = collectParams();

  /* ======================================================================
     2) MONTAGEM DO LINK DE CHECKOUT
     ====================================================================== */
  function buildCheckoutUrl() {
    var url;
    try {
      url = new URL(CHECKOUT_URL);
    } catch (e) {
      return CHECKOUT_URL;
    }

    var key;
    for (key in PARAMS) {
      if (Object.prototype.hasOwnProperty.call(PARAMS, key) && PARAMS[key]) {
        url.searchParams.set(key, PARAMS[key]);
      }
    }

    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    if (fbp) url.searchParams.set('fbp', fbp);
    if (fbc) url.searchParams.set('fbc', fbc);

    return url.toString();
  }

  /* ======================================================================
     3) RASTREAMENTO DE INTERAÇÃO
     ====================================================================== */
  function newEventId(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' +
      Math.random().toString(36).slice(2, 10);
  }

  function pushDataLayer(event, payload) {
    window.dataLayer = window.dataLayer || [];
    var data = { event: event };
    var k;
    for (k in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, k)) data[k] = payload[k];
    }
    window.dataLayer.push(data);
  }

  /* Envia o mesmo evento para a CAPI, com o mesmo eventID do Pixel.
     Só roda quando CAPI_ENDPOINT estiver configurado (proxy server-side). */
  function sendToCapi(eventName, eventId, custom) {
    if (!CAPI_ENDPOINT) return;
    var body = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      action_source: 'website',
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      user_data: {
        em: PARAMS.email || '',
        ph: PARAMS.phone || '',
        fn: PARAMS.name || ''
      },
      custom_data: custom || {}
    };
    try {
      var blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      if (navigator.sendBeacon && navigator.sendBeacon(CAPI_ENDPOINT, blob)) return;
      fetch(CAPI_ENDPOINT, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })['catch'](function () {});
    } catch (e) {}
  }

  /* PageView server-side espelhando o eventID já gerado no <head>. */
  sendToCapi('PageView', window.ODR_PAGEVIEW_EVENT_ID || newEventId('pv'), {});

  function trackCheckoutClick(ctaId) {
    var eventId = newEventId('ic');

    pushDataLayer('odr_checkout_click', {
      cta_id: ctaId,
      value: 397,
      currency: 'BRL',
      event_id: eventId
    });

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Método ODR',
        content_ids: ['metodo-odr'],
        content_type: 'product',
        value: 397,
        currency: 'BRL'
      }, { eventID: eventId });
    }

    sendToCapi('InitiateCheckout', eventId, {
      content_name: 'Método ODR',
      value: 397,
      currency: 'BRL'
    });
  }

  /* ======================================================================
     4) CTAs
     ====================================================================== */
  var offer = document.getElementById('oferta');

  /* Scroll até o botão principal da oferta (não até o topo da seção): com
     block:'end' o navegador sempre alinha a base do botão ao rodapé da
     viewport, então o CTA nunca fica cortado — em telas baixas some parte
     do preço acima, mas o botão continua 100% visível; em telas altas a
     seção inteira aparece do mesmo jeito, só com folga acima. */
  function scrollToOffer() {
    if (!offer) return;
    var target = offer.querySelector('.btn--primary') || offer;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-cta]') : null;
    if (!el) return;

    var mode = el.getAttribute('data-cta');
    var ctaId = el.getAttribute('data-cta-id') || 'cta';

    if (mode === 'checkout') {
      /* href já foi reescrito no load; só registramos o evento. */
      trackCheckoutClick(ctaId);
      return;
    }

    ev.preventDefault();
    pushDataLayer('odr_cta_scroll', { cta_id: ctaId });
    scrollToOffer();

    if (history.replaceState) history.replaceState(null, '', '#oferta');
  });

  /* Reescreve os CTAs de checkout com o link + parâmetros repassados. */
  (function applyCheckoutLinks() {
    var href = buildCheckoutUrl();
    var nodes = document.querySelectorAll('[data-cta="checkout"]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('href', href);
      nodes[i].setAttribute('rel', 'noopener');
    }
  })();

  /* ======================================================================
     5) FAQ ACCORDION
     ====================================================================== */
  var faqButtons = document.querySelectorAll('.faq__q');
  for (var f = 0; f < faqButtons.length; f++) {
    faqButtons[f].addEventListener('click', function () {
      var open = this.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(this.getAttribute('aria-controls'));
      var item = this.closest('.faq__item');

      this.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) panel.hidden = open;
      if (item) item.classList.toggle('is-open', !open);

      if (!open) {
        pushDataLayer('odr_faq_open', {
          faq_question: (this.textContent || '').trim()
        });
      }
    });
  }

  /* ======================================================================
     6) BARRA FIXA DE CTA (MOBILE)
     Aparece depois do hero e some quando a seção de oferta está na tela.
     ====================================================================== */
  var bar = document.getElementById('stickybar');
  var hero = document.getElementById('topo');

  if (bar && hero && 'IntersectionObserver' in window) {
    var pastHero = false;
    var atOffer = false;

    function sync() {
      var show = pastHero && !atOffer;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    }

    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      sync();
    }, { rootMargin: '-40% 0px 0px 0px' }).observe(hero);

    if (offer) {
      new IntersectionObserver(function (entries) {
        atOffer = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.25 }).observe(offer);
    }
  }

  /* ======================================================================
     7) MISC
     ====================================================================== */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
