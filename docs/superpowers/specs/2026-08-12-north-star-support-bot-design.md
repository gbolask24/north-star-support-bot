# North Star Support Bot — Design Spec

**Date:** 2026-08-12
**Project:** Upwork Talent Accelerator — AI Chatbot Developer (simulated client project)
**Goal:** Fully reviewable customer support chatbot for a fictional outdoor apparel & camping gear e-commerce store. Target: 5-star evaluation.

## 1. Overview

A self-contained, zero-dependency chat web app ("North Star Support Bot") embedded as a floating widget on a static mock storefront page. No APIs, no keys, no accounts — evaluators test via a live Vercel URL, by opening the built single-file `dist/index.html`, or by running the repo locally.

## 2. Stack

- **Vite + TypeScript**, vanilla (no framework), zero runtime dependencies
- **Vitest** for unit tests (intent recognition + order logic + flow transitions)
- **vite-plugin-singlefile** so `dist/index.html` is one self-contained artifact
- Deployed to **Vercel** (static)

## 3. Architecture

Three engine layers, cleanly separated from the UI:

| Module | Responsibility |
|---|---|
| `src/engine/data.ts` | All provided business data: mock orders, return policy, shipping info, returns link, product category matrix. Nothing invented beyond the brief. |
| `src/engine/intents.ts` | Deterministic intent recognizer: input normalization + keyword/phrase/regex scoring. Intents: `track_order`, `returns`, `recommend`, `shipping_info`, `human`, `greeting`, `thanks`, `goodbye`, `menu`, plus order-number extraction and yes/no detection. |
| `src/engine/flows.ts` | State machine: `MAIN_MENU → (ORDER_TRACKING | RETURNS | RECOMMEND_Q1 → RECOMMEND_Q2 | LIVE_AGENT)` and back. Every resolved flow returns the user to the main flow. Two-strike fallback: (1) "didn't catch that" + option chips, (2) offer live-agent escalation. |
| `src/ui/*` | Chat widget: message list, typing indicator, quick-reply chips + free-text input, timestamps, Live Agent visual state (avatar/color change, simulated agent "Riley"), return-to-menu affordance during handoff. |
| `src/store/*` | Static mock storefront backdrop (hero, fake product cards) with floating chat bubble. Pure presentation; no functionality. |

## 4. Business rules (from brief — authoritative)

- **Orders:** #111 → Shipped, arriving tomorrow · #222 → Processing, ships in 24 hours · #333 → Delivered (ask follow-up) · anything else → invalid
- **Returns:** 30-day returns · items unused · original packaging required · provide returns link (clearly simulated URL)
- **Shipping:** Standard 3–5 business days · Expedited 1–2 business days
- **Recommendations:** ask exactly 1–2 clarifying questions → recommend a product **category** (no invented SKUs)
- **Handoff:** explicit request or fallback escalation → simulated Live Agent state, clearly communicated, user can return to main menu or keep chatting after handoff
- **Persona:** friendly, helpful, outdoorsy, concise; North American audience

## 5. Testing

- Vitest unit tests: intent phrasing variations (≥5 per core intent), the 4 order cases exactly, flow transitions incl. fallback strikes and handoff return.
- `TESTING.md`: manual script mirroring the submission checklist item-by-item.

## 6. Deliverables

1. Code repository with README (run instructions + requirements-coverage table)
2. Live Vercel URL + single-file `dist/index.html`
3. `VIDEO_SCRIPT.md`: timed 2–3 min narration + shot list covering all 4 use cases + one fallback

## 7. Out of scope

Real backend, real products/SKUs, LLM/NLP services, accounts, payments, deployment beyond static hosting.
