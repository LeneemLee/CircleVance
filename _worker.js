// All hostnames serve the same Pages assets; only public domain identity varies.
const domains = new Set([
  'cyclevancematerials.com', 'cyclevancepolymers.com',
  'cyclevancesupply.com', 'cyclevanceplastics.com'
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const domain = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!domains.has(domain)) return env.ASSETS.fetch(request);

    // Fetch full text before adapting it. A static asset's validators/ranges
    // describe the original bytes and must not validate a transformed response.
    const headers = new Headers(request.headers);
    for (const name of ['if-none-match', 'if-modified-since', 'range', 'if-range']) headers.delete(name);
    const response = await env.ASSETS.fetch(new Request(request, { headers }));
    const type = response.headers.get('content-type') || '';
    if (!/text\/|javascript|application\/xml|application\/json/i.test(type) || response.status !== 200) return response;

    const resultHeaders = new Headers(response.headers);
    for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'accept-ranges', 'content-md5', 'digest']) resultHeaders.delete(name);
    resultHeaders.set('cache-control', 'no-store');
    const body = request.method === 'HEAD' ? null : (await response.text()).replace(/cyclevance\.com/gi, domain);
    return new Response(body, { status: response.status, statusText: response.statusText, headers: resultHeaders });
  }
};
