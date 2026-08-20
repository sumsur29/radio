// Vercel serverless function: re-serves an http radio stream over https.
// Deploy this folder to Vercel, then in apna-radio.html set:
//   const PROXY = "https://<your-project>.vercel.app/api/stream?url=";
export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) { res.status(400).send("missing url"); return; }
  try {
    const upstream = await fetch(target, { headers: { "User-Agent": "ApnaRadio/1.0" } });
    if (!upstream.ok || !upstream.body) { res.status(502).send("bad upstream"); return; }
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    // stream the audio through
    const reader = upstream.body.getReader();
    res.status(200);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (e) {
    res.status(500).send("proxy error: " + e.message);
  }
}
