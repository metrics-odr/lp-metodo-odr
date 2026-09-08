/* ==========================================================================
   ODR LP — Cloudflare Worker: proxy da API de Conversões (CAPI) do Meta
   ==========================================================================
   Recebe PageView/InitiateCheckout da landing page (via CAPI_ENDPOINT em
   assets/js/script.src.js) e repassa pro Graph API do Meta. O access token
   fica em variável de ambiente do Worker — nunca neste arquivo, nunca no
   repositório.

   DEPLOY (gratuito, até 100 mil requisições/dia):
   1. https://dash.cloudflare.com → crie uma conta free (se ainda não tiver)
   2. Workers & Pages → Create → Create Worker → dê um nome (ex.: odr-lp-capi)
   3. "Edit code" → apague o conteúdo padrão → cole este arquivo inteiro
   4. Settings → Variables and Secrets → adicione como "Secret":
        META_ACCESS_TOKEN = <token de acesso do Gerenciador de Eventos>
        META_PIXEL_ID     = 2180723985697542
   5. Deploy. Copie a URL (algo como https://odr-lp-capi.<subdomínio>.workers.dev)
   6. Cole essa URL em CAPI_ENDPOINT no assets/js/script.src.js e rode
      ./scripts/build.sh
   ========================================================================== */

var ALLOWED_ORIGIN = 'https://metrics-odr.github.io';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    var body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response('Bad Request', { status: 400 });
    }

    var eventName = String(body.event_name || '').slice(0, 64);
    if (!eventName) return new Response('Bad Request', { status: 400 });

    var userData = {};
    if (body.fbp) userData.fbp = String(body.fbp);
    if (body.fbc) userData.fbc = String(body.fbc);
    var ip = request.headers.get('CF-Connecting-IP');
    var ua = request.headers.get('User-Agent');
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;

    var payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: String(body.event_id || ''),
          event_source_url: String(body.event_source_url || ''),
          action_source: 'website',
          user_data: userData,
          custom_data: {
            value: typeof body.value === 'number' ? body.value : 0,
            currency: body.currency || 'BRL',
            content_name: body.content_name || '',
          },
        },
      ],
    };

    var url = 'https://graph.facebook.com/v21.0/' + env.META_PIXEL_ID +
      '/events?access_token=' + env.META_ACCESS_TOKEN;

    try {
      var metaRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return new Response(JSON.stringify({ ok: metaRes.ok }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    } catch (e) {
      return new Response('Upstream error', { status: 502 });
    }
  },
};
