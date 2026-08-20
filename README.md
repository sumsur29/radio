# Apna Radio — deploy

A single static page (`index.html`) + two tiny serverless functions in `/api`.
No build step.

## Deploy to Vercel (≈2 min)
**Option A — drag & drop (easiest)**
1. Go to vercel.com → Add New → Project → "Deploy" (or the "Import" / upload flow).
2. Drag this whole `deploy/` folder in. Vercel auto-detects `index.html` + the `/api` functions.
3. Click Deploy. You get a URL like `https://apna-radio.vercel.app`.

**Option B — git**
1. Push this `deploy/` folder to a GitHub repo.
2. Vercel → Add New → Project → import the repo → Deploy.

## After deploy
Nothing to configure. Because the page and the `/api` functions live on the
same domain, Kadak automatically calls `/api/admn` for a fresh stream token
every time you play it — no expiry issues.

## Add to Home Screen (iPhone)
Open the Vercel URL in Safari → Share → Add to Home Screen.
Launch it from the icon for full-screen + lock-screen / AirPods controls.
Tap a station once to start, then AirPods double-tap = next station.

## Files
- `index.html`   the app
- `api/admn.js`  resolves a fresh Kadak (Abu Dhabi Media) stream URL
- `api/stream.js` optional http→https proxy (for any http-only station)
- `vercel.json`  function config
