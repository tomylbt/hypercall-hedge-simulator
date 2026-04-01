// Vercel serverless CORS proxy for Hypercall API
export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  const baseUrl = 'https://testnet-api.hypercall.xyz';
  const url = new URL(endpoint, baseUrl);

  // Forward all other query params
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream timeout' });
    }
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Proxy request failed', message: err.message });
  }
}
