# ☕ Date Quiz — Мenк surj xmenk?

A playful Armenian quiz app to settle an unfulfilled coffee date.

---

## 🚀 Run locally (VS Code)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open **http://localhost:3000** in your browser.  
In VS Code → **Ports** tab → the port `3000` will appear — click **Open in Browser** or share the forwarded URL.

---

## 🌍 Deploy for FREE on Vercel (recommended for Next.js)

**Option A — Drag & drop (fastest, no account needed... almost)**

1. Push to GitHub:
   ```bash
   git init && git add . && git commit -m "date quiz"
   # Create a repo at github.com, then:
   git remote add origin https://github.com/YOUR_NAME/date-quiz.git
   git push -u origin main
   ```
2. Go to **vercel.com** → **Add New Project** → Import from GitHub
3. Click **Deploy** — done! You get a free `*.vercel.app` URL 🎉

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel
# Follow prompts → get live URL in ~60 seconds
```

---

## 🐙 Also free on GitHub Pages (static export)

Add to `next.config.ts`:
```ts
output: 'export'
```
Then push to GitHub → Settings → Pages → Deploy from `/out` folder.

---

## 📁 Project structure

```
app/
  layout.tsx     — Root layout + fonts
  page.tsx       — All 6 quiz steps
  globals.css    — Full custom styling (dark romantic theme)
components/
  ui/provider.tsx — Chakra UI v3 provider
```

---

Built with Next.js 15 + Chakra UI v3 ✦
