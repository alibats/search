
# PS3-compatible local search (English)

This is a minimal search page designed to work on older browsers such as the PS3 browser. It reads results from a local JSON file and performs a simple client-side search.

Quick start:

1. Place `ps3_mega_sites.json` and the page files (`index.html`, `styles.css`, `script.js`) in the same folder.
2. Serve the folder over HTTP (some devices block XHR from file://). Example using Python 3:

```bash
python -m http.server 8000
```

Or with Python 2:

```bash
python -m SimpleHTTPServer 8000
```

Open: `http://<your-pc-ip>:8000/index.html` or `http://localhost:8000/index.html`.

Compatibility notes:
- HTML uses HTML4 DOCTYPE and simple tags (`div`, `table`, `form`).
- JavaScript uses `var` and `XMLHttpRequest` (no ES6, no fetch, no modules).
- CSS is legacy-friendly (no Flexbox or Grid).

Features:
- Centered, Google-like search UI.
- Simple search (substring match) across title, description and URL.
- "I'm Feeling Lucky" button opens the first matched result.

If you want relevance ranking, fielded search, or advanced UI changes, tell me which features to add.
