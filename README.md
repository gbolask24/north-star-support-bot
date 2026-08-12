# ⭐ North Star Support Bot

A customer support chatbot for **North Star Outfitters**, a fictional North American
e-commerce store for outdoor apparel and camping gear. The bot lives inside a fully
interactive demo storefront (shop, product pages, cart, FAQ) and ships as a fully
reviewable, zero-setup deliverable: **no API keys, no accounts, no subscriptions, no
install steps required to test it.**

![Tests](https://img.shields.io/badge/tests-93%20passing-brightgreen) ![Dependencies](https://img.shields.io/badge/runtime%20deps-0-blue)

---

## 🚀 Review it in 10 seconds

| Option | How |
|---|---|
| **1. Live demo** | Open the deployed URL (see submission notes). The chat bubble is bottom-right. |
| **2. Single file** | Double-click **`North-Star-Support-Bot-DEMO.html`** (or `dist/index.html`, same file). The entire app, fonts included, is one self-contained file and works offline. |
| **3. Run locally** | `npm install && npm run dev` then visit http://localhost:5173 |

No environment variables, no keys, no accounts. The bot is 100% deterministic, so
every evaluator gets identical behavior.

## ✅ Requirements coverage

| Brief requirement | Where to see it |
|---|---|
| **Order tracking** (ask for number, simulated status) | "📦 Track my order" or type *"where's my order?"* |
| Order #111: Shipped, arriving tomorrow | Type `111` |
| Order #222: Processing, ships in 24 hours | Type `222` |
| Order #333: Delivered + follow-up question | Type `333`. The bot asks if everything's okay. |
| Any other number: invalid | Type `999` for a polite retry with options |
| **Returns & exchanges** (policy + link) | "↩️ Returns & exchanges" shows 30-day / unused / original packaging + returns link |
| **Product recommendations** (1-2 clarifying Qs, then category) | "🧭 Gear recommendations", pick an activity, pick a style |
| **Human handoff** (explicit or fallback escalation) | "💬 Talk to a live agent". The header switches to **Riley · Live Agent** (navy). Keep chatting or return to the main menu. |
| **Intent recognition** (phrasing variations) | Try *"track my package"*, *"wheres my stuff"*, *"refund please"*, *"talk to a human"*. Free text works everywhere. |
| **Shipping info** | "🚚 Shipping info": Standard 3-5 business days, Expedited 1-2 |
| **Fallback handling** (two-strike) | Type gibberish once for "didn't catch that" + options; twice and a live agent is offered |
| **Return to main flow after resolution** | Every flow ends with "Anything else?" + menu chips |

## 🏬 The demo storefront

The bot is embedded in a working (simulated) store so evaluators see it the way a real
customer would:

- **Shop**: 16 products across the same categories the bot recommends, with activity filters
- **Product pages**: details, shipping and returns perks, "Add to cart", and an
  **"Ask the bot about this"** button that opens the chat pre-loaded with a matching question
- **Cart**: quantity steppers, remove, subtotal, simulated checkout (client-side only, persists in localStorage)
- **FAQ & Support**: accordion answers, each with an "Ask the bot" button that sends the
  question straight into the chat
- **About**: brand story page

It is all hash-routed inside one HTML file, so back/forward works, URLs are shareable
(`#/shop/winter`, `#/product/firefly-2p`), and the single-file build stays intact.
The store is presentational staging: the chatbot itself only ever quotes the business
data provided in the project brief.

## 🏗️ How it works

```
src/
├── engine/            # Pure TypeScript, no DOM, fully unit tested
│   ├── data.ts        # All business data from the brief (orders, policy, shipping, categories)
│   ├── intents.ts     # Deterministic intent recognizer (weighted keyword/phrase scoring)
│   └── flows.ts       # Conversation state machine (menu, tracking, returns, reco, live agent, fallback)
├── store/             # Demo storefront
│   ├── catalog.ts     # Products and filters
│   ├── cart.ts        # Cart logic (pure functions, unit tested) + localStorage
│   ├── router.ts      # Hash router (#/shop, #/product/:id, #/cart, ...)
│   ├── views.ts       # HTML renderers per page
│   └── store.ts       # Controller: routing, cart state, toasts, delegated events
├── ui/
│   └── chat.ts        # Chat widget: typing indicator, chips, live-agent header state
├── style.css          # Design system (self-hosted fonts, reduced-motion support)
└── main.ts            # Entry point

tests/                 # 93 Vitest tests: intent variations, exact mock-order logic,
                       # flow transitions, fallback strikes, handoff + return, cart math
```

**Design decision: no LLM, on purpose.** The brief requires exact mock data, provided
copy only, and a submission any evaluator can test identically without keys. A
deterministic intent engine (normalization + weighted keyword/phrase scoring) meets the
intent-variation requirement while staying 100% predictable, testable, and free to run.
The conversation engine is cleanly separated from the UI, so swapping in an LLM/NLU
service later would touch only `intents.ts`.

## 🧪 Tests

```bash
npm test
```

93 tests cover: 5+ phrasing variations per core intent, the four order cases exactly as
specified, policy and shipping wording, both recommendation questions, fallback strike
logic and reset, the full handoff and return-to-menu loop, and cart math. See
`TESTING.md` for the manual walkthrough matching the submission checklist.

## 📦 Build & deploy

```bash
npm run build   # type-checks, builds a single self-contained HTML file,
                # and refreshes North-Star-Support-Bot-DEMO.html
```

Deploy anywhere static (Vercel: import the repo, framework preset "Vite", done. Or
`npx vercel --prod`). No server, no environment config.

## 📄 Provided business data (from the brief)

- **Returns:** 30-day returns · items unused · original packaging required
- **Shipping:** Standard 3-5 business days · Expedited 1-2 business days
- **Orders:** #111 Shipped (tomorrow) · #222 Processing (24 h) · #333 Delivered · others invalid

*North Star Outfitters is a fictional store; the returns link is a simulated
`.example.com` URL by design.*
