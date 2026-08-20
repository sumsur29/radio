// Resolves a fresh, signed Abu Dhabi Media radio stream (e.g. Kadak FM).
// The admn.ae player page returns a new short-lived .m3u8 each request, so we
// fetch it server-side (no CORS) and hand the app a fresh URL.
//   App call: GET /api/admn?id=3f4631c4-4137-11eb-8fed-501ac5085fa0  -> { url: "...m3u8" }
export default async function handler(req, res) {
  const id = req.query.id || "3f4631c4-4137-11eb-8fed-501ac5085fa0"; // default: Kadak FM
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  try {
    const r = await fetch(`https://www.admn.ae/audio/stream-player/${id}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await r.text();
    const m = html.match(/https:\/\/[^"'\s)]+\.m3u8[^"'\s)]*/);
    if (!m) { res.status(404).json({ error: "no stream found" }); return; }
    res.status(200).json({ url: m[0].replace(/&amp;/g, "&") });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
