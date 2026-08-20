# Radio — Project Handover

A single-file HTML/PWA **radio app** ("Radio") for Sumeet (Dubai / hometown Indore).
Skeuomorphic wooden vintage-radio UI. Bollywood + English + Classic + AI stations.
Deployed via GitHub → Vercel. Everything lives in one `index.html` (HTML + CSS + JS inline).

---

## Repo / deploy

- **GitHub:** https://github.com/sumsur29/radio.git (user `sumsur29`, repo `radio`)
- **Vercel** auto-redeploys on every push to `main`.
- Deploy from inside the `deploy/` folder each time:

```bash
cd ~/Downloads/deploy
git init && git add . && git commit -m "message"
git branch -M main
git remote add origin https://github.com/sumsur29/radio.git
git push -u origin main --force
```
If it says `remote origin already exists`:
```bash
git remote set-url origin https://github.com/sumsur29/radio.git
git push -u origin main --force
```
**One-time convenience** (so future deploys are just add/commit/push):
```bash
cd ~/Downloads && git clone https://github.com/sumsur29/radio.git radio-live
# then drop new index.html into radio-live/ and: git add . && git commit -m "x" && git push
```
After deploy: hard-refresh, or delete + re-add the Home Screen icon (iOS caches the PWA + manifest name aggressively).

---

## Files in `deploy/`

- `index.html` — the entire app (single file, ~28 KB). **This is the only thing you normally edit.**
- `manifest.json` — PWA manifest. `name`/`short_name` = `"Radio"`.
- `api/admn.js` — Vercel serverless fn: resolves a fresh Kadak FM (ADM/StarzPlay) m3u8 stream.
- `api/stream.js` — http→https proxy (rarely used now).
- `vercel.json`, `package.json` (`{"private":true,"type":"module"}`)
- Icons: `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-1024.png`
- `README.md`

## Build workflow each change
1. Edit `deploy/index.html` (str_replace / python).
2. Validate JS: extract the inline `<script>` and run `node --check`.
3. `cp deploy/index.html apna-radio.html` (standalone copy).
4. Re-zip → `apna-radio-deploy.zip`.
5. Present files + give the git deploy block.

There is **no headless browser** in the sandbox and the local file can't be loaded into the user's browser, so **Claude cannot self-screenshot** — the user screenshots to verify visuals.

---

## Current stations (14) — with real stream URLs

Grouped in the preset bank under labels **HINDI / ENGLISH / CLASSIC / AI RADIO**.
Each station object: `{id,name,short,sub,badge,unit,mhz,hard[],rb[[name,cc]...], resolve?}`.
- `hard[]` = hardcoded stream URL(s), tried first (for non-resolve stations).
- `rb[]` = radio-browser search queries (name, countrycode) — live directory fallback.
- `resolve` = special resolver id (Kadak only).
- `unit` = `"FM"` (shows MHz) or `"AI"`/`"·"` (shows "LIVE").

**HINDI**
- City 1016 — `101.6` — rb `[["City 1016","AE"],["City 101.6","AE"]]` (ARN, resolves live; works)
- Radio Mirchi — `102.4` — hard `https://playerservices.streamtheworld.com/api/livestream-redirect/DUB_HIN_GST.mp3` (official StreamTheWorld Dubai feed; the old fastcast4u mount died)
- Kadak FM — `88.8` — `resolve:"3f4631c4-4137-11eb-8fed-501ac5085fa0"` via `/api/admn` + stale hard m3u8 fallback
- FunAsia — `89.1` — hard `https://funasia.streamguys1.com/live9`
- Red FM 93.5 — `93.5` — hard `https://stream.zeno.fm/q97eczydqrhvv`

**ENGLISH** (all ARN; radiojar URLs grabbed via DevTools on the official sites)
- Dubai 92 — `92.0` — hard `https://stream.radiojar.com/6ty5rrkerxquv`
- Virgin Radio — `104.4` — hard `https://stream.radiojar.com/nhq0vcqwuueuv`
- Dubai Eye — `103.8` — rb `[["Dubai Eye","AE"],["Dubai Eye 103.8","AE"]]` (resolves live; works)
- (Channel 4 104.8 was **removed** — no open stream.)

**CLASSIC**
- Vividh Bharati — badge `AIR` — rb `[["Vividh Bharati",""],["Vividh Bharti",""],["Vividhbharati",""]]`
- Mirchi Mehfil — badge `♪` — rb `[["Mirchi Mehfil",""],["Mehfil Ghazal",""],["Ghazal",""],["Retro Bollywood",""]]`

**AI RADIO** (Andon FM — https://andonlabs.com/radio — Live365 MP3 streams)
- Thinking Frequencies — badge `Claude` — hard `https://streaming.live365.com/a46431`
- OpenAIR — badge `GPT` — hard `https://streaming.live365.com/a81044`
- Backlink Broadcast — badge `Gemini` — hard `https://streaming.live365.com/a13541`
- Grok and Roll — badge `Grok` — hard `https://streaming.live365.com/a15419`

(Andon mounts sourced from the open-source `andon-cone` README: tangled.org/aparker.io/andon-cone.
Live365 metadata isn't used; audio = `https://streaming.live365.com/<mount>`.)

---

## Design (skeuomorphic wooden radio)

- Full-screen wooden body (walnut/brass gradients, film-grain overlay), respects **all** safe-area insets (top/bottom + **left/right for the landscape notch**).
- Brass-framed **speaker grille** (slats + dot mesh) — grows to fill height in portrait; collapses to a thin strip in landscape.
- Brass nameplate reads **"Radio"** (italic Fraunces). Renamed several times (Apna Radio → Lehar → Radio Bombay → Bollywood Radio → **Radio**). To rename: change the `.badge-brand` text, `<title>`, `apple-mobile-web-app-title` meta, `manifest.json` name/short_name, and the MediaMetadata `album`.
- Lit amber **dial**: fine tick scale 87→108, amber pips at each station's `mhz`, red tuning **marker** that glides, a glowing **readout window** (`#bigfreq` model/frequency + `#wunit` "MHz"/"LIVE" + `#bigname` italic station name). `sweepTo()` animates marker + rolling number + tuning-knob rotation together.
- Two knurled metal knobs: **VOLUME** (left, draggable) + **TUNING** (right, rotates with the dial; tap = next station).
- Cream push-buttons ◄◄ ► ►► ; small lock 📌 / retry ↻ appear when playing.
- Flat preset **pill bank** grouped by the labels above.
- Fonts: **Fraunces** (serif), **DM Mono** (dial numerals), **Oswald** (display), via Google Fonts.
- Palette vars: espresso/walnut wood, brass (`--brass1..4`), amber `#c8761b`/`#f4a93c`, red marker `#e0382a`, cream `#ece0c6`.
- **Landscape** (`@media (max-height:560px)`): CSS-grid two-pane layout — thin grille strip on top, wide dial across, controls (knobs+transport) on the **left**, presets in a **scrollable panel** on the **right**. Nothing gets clipped; only the grille trims.

---

## Playback engine (key functions in the inline `<script>`)

- `STATIONS[]`, `ORDER[]`, `ALL{}`, `GRP{}` (station → group), render order `["Hindi","English","Classic","AI Radio"]`.
- **Resolution:** `prewarm()` resolves rb/resolve stations on load into in-memory `CACHE`. `rbSearch()` queries `de1`/`nl1.api.radio-browser.info` — **relaxed**: no `hidebroken`, returns `lastcheckok===1` first then the rest, uses `url_resolved||url`. `resolveADM()` hits `/api/admn` for Kadak.
- **Background-safe switching (the important part for iOS lock screen):**
  - `readyUrl(s)` / `readyList(s)` = pin → lastGood(localStorage) → hard → CACHE (no network).
  - `switchTo(s)` = SYNCHRONOUS `attach()` to a ready URL (no teardown, no network in hot path), then `confirmPlay()` verifies via `playing`/`error` + 4.2 s timeout, falling back through remaining ready candidates, then a last-resort `resolveStation()`.
  - `attach(url)` prefers **native HLS** on iOS (`audio.canPlayType('application/vnd.apple.mpegurl')`) over hls.js; for direct streams just sets `audio.src` (assigning src replaces source — keeps the iOS audio session alive; **no** `removeAttribute`/`load()` between tracks).
  - Global `audio` listeners (`playing`/`pause`/`ended`) keep UI + MediaSession synced and auto-reconnect on `ended`. `visibilitychange` re-warms caches on return.
  - MediaSession next/prev → `navStation` → `switchTo`. `fullStop()` only on explicit toggle-off.
- **Pins / lastGood** persisted in `localStorage` (`apnaradio_pins`, `apnaradio_last`). Lock 📌 pins the current working feed; retry ↻ (`anotherFeed`) forces the next feed.
- **Volume knob:** pointer-drag sets `audio.volume` + `audio.muted` (persisted `radio_vol`); label flips to "MUTED" at 0.
  - **iOS caveat:** iOS ignores `audio.volume` for streaming audio (hardware buttons control level). On iPhone the knob works as **mute/unmute** only; full range works on Mac/desktop/Android. (A Web-Audio GainNode could force iOS levels but would silence non-CORS streams, so it was intentionally NOT used.)

---

## Known constraints & lessons learned

- **ARN Dubai music streams** (Dubai 92 / Virgin) aren't in directories with open URLs and Virgin's directory entry is geo-locked ("not available in your territory" = it matched Virgin **UK**). **Solution that worked:** open the station's own site (dubai92.com, virginradiodubai.com) in desktop Chrome, and in the Console run:
  ```js
  [...document.querySelectorAll('audio,video')].map(a=>a.currentSrc||a.src)
  ```
  → returns the real `stream.radiojar.com/...` URL. (Chrome shows a "allow pasting" warning first time — it's generic; the line only reads.) This is the reliable method for any locked station. Channel 4 was dropped (no open stream).
- **radiojar streams** (Dubai 92 / Virgin) occasionally drop mid-stream then recover — that's the feed, not the app. The app auto-reconnects on `ended`.
- **Radio Mirchi** = single national feed (no separate Dubai stream). The fastcast4u mount died; now uses the official StreamTheWorld `DUB_HIN_GST` feed (found via worldradiomap.com/ae/play/mirchi, which lists raw URLs).
- Sources that expose **raw** stream URLs in plain HTML (fetchable): worldradiomap.com, media.info, radiobarfi.com. onlineradiobox/official players hide them in JS (use the DevTools trick).
- `web_fetch` only works on URLs from prior search/fetch results or user-provided; TuneIn `opml.radiotime.com/Tune.ashx` is blocked unless surfaced by a search first.
- The Chrome browser MCP tool timed out/was unreliable in these sessions — don't depend on it.

---

## Pending / offered (not yet done)

- **Stall watchdog** (OFFERED, not added): auto-reconnect if audio goes silent ~10–15 s while it's supposed to be playing (smooths radiojar mid-stream drops that don't fire a clean `ended`). Ready to add if the user says yes.
- If any AI station or a directory-resolved station fails, grab a fresh URL via the DevTools recipe and hardcode it.

## User notes
- Sumeet is a non-engineer but very comfortable with Terminal/git/Vercel; iterates via screenshots; values **honesty about real constraints** (iOS volume limit, locked ARN streams, single Mirchi feed) over shipping broken cards.
- Keep responses concise; always end a change with the git deploy block.
