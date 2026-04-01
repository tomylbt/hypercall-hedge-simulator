export default async function handler(req, res) {
  const { path, ...params } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  const queryParts = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  
  const url = `https://testnet-api.hypercall.xyz/${path}${queryParts ? '?' + queryParts : ''}`;

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({ error: `Upstream error: ${error.message}` });
  }
}
