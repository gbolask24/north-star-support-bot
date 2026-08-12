# ⭐ North Star Support Bot

A customer support chatbot for **North Star Outfitters**, a fictional North American
e-commerce store for outdoor apparel and camping gear. Built as a fully reviewable,
zero-setup deliverable: **no API keys, no accounts, no subscriptions, no install steps
required to test it.**

![Tests](https://img.shields.io/badge/tests-84%20passing-brightgreen) ![Dependencies](https://img.shields.io/badge/runtime%20deps-0-blue)

---

## 🚀 Review it in 10 seconds

| Option | How |
|---|---|
| **1. Live demo** | Open the deployed URL (see submission notes) — the chat bubble is bottom-right |
| **2. Single file** | Double-click **`North-Star-Support-Bot-DEMO.html`** (or `dist/index.html`, same file) — the entire app, fonts included, self-contained and works offline |
| **3. Run locally** | `npm install && npm run dev` → http://localhost:5173 |

No environment variables, no keys, no accounts. The bot is 100% deterministic —
every evaluator gets identical behavior.

## ✅ Requirements coverage

| Brief requirement | Where to see it |
|---|---|
| **Order tracking** (ask for number, simulated status) | "📦 Track my order" or type *"where's my order?"* |
| Order #111 → Shipped, arriving tomorrow | Type `111` |
| Order #222 → Processing, ships in 24 hours | Type `222` |
| Order #333 → Delivered + follow-up question | Type `333` — bot asks if everything's okay |
| Any other number → invalid | Type `999` — polite retry with options |
| **Returns & exchanges** (policy + link) | "↩️ Returns & exchanges" — 30-day / unused / original packaging + returns link |
| **Product recommendations** (1–2 clarifying Qs → category) | "🧭 Gear recommendations" → activity → detail → category |
| **Human handoff** (explicit or fallback escalation) | "💬 Talk to a live agent" — header switches to **Riley — Live Agent** (navy), user can keep chatting or return to main menu |
| **Intent recognition** (phrasing variations) | Try *"track my package"*, *"wheres my stuff"*, *"refund please"*, *"talk to a human"* — free text works everywhere |
| **Shipping info** | "🚚 Shipping info" — Standard 3–5 business days, Expedited 1–2 |
| **Fallback handling** (two-strike) | Type gibberish once → "didn't catch that" + options; twice → live agent offered |
| **Return to main flow after resolution** | Every flow ends with "Anything else?" + menu chips |

## 🏗️ How it works

```
src/
├── engine/            # Pure TypeScript, no DOM — fully unit tested
│   ├── data.ts        # All business data from the brief (orders, policy, shipping, categories)
│   ├── intents.ts     # Deterministic intent recognizer (weighted keyword/phrase scoring)
│   └── flows.ts       # Conversation state machine (menu, tracking, returns, reco, live agent, fallback)
├── ui/
│   └── chat.ts        # Chat widget: typing indicator, chips, live-agent header state
├── style.css          # Design system (self-hosted fonts, reduced-motion support)
└── main.ts            # Entry point

tests/                 # 84 Vitest tests: intent variations, exact mock-order logic,
                       # flow transitions, fallback strikes, handoff + return
```

**Design decision — no LLM, on purpose.** The brief requires exact mock data, provided
copy only, and a submission any evaluator can test identically without keys. A
deterministic intent engine (normalization + weighted keyword/phrase scoring) meets the
intent-variation requirement while staying 100% predictable, testable, and free to run.
The conversation engine is cleanly separated from the UI, so swapping in an
LLM/NLU service later would touch only `intents.ts`.

## 🧪 Tests

```bash
npm test
```

84 tests cover: ≥5 phrasing variations per core intent, the four order cases exactly as
specified, policy/shipping wording, both recommendation questions, fallback strike
logic and reset, and the full handoff → return-to-menu loop. See `TESTING.md` for the
manual walkthrough matching the submission checklist.

## 📦 Build & deploy

```bash
npm run build   # type-checks, then emits a single self-contained dist/index.html
```

Deploy anywhere static (Vercel: import the repo, framework preset "Vite", done —
or `npx vercel --prod`). No server, no environment config.

## 📄 Provided business data (from the brief)

- **Returns:** 30-day returns · items unused · original packaging required
- **Shipping:** Standard 3–5 business days · Expedited 1–2 business days
- **Orders:** #111 Shipped (tomorrow) · #222 Processing (24 h) · #333 Delivered · others invalid

*North Star Outfitters is a fictional store; the returns link is a simulated
`.example.com` URL by design.*
