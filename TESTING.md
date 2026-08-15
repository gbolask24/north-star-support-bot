# 🧪 Manual Test Script, North Star Support Bot

This walkthrough mirrors the submission checklist. Total time: ~4 minutes.
Open the app (live URL, `North-Star-Support-Bot-DEMO.html`, or `npm run dev`) and
click the ⭐ chat bubble (bottom-right).

## 1. Welcome & main menu

- [ ] Bot greets with outdoorsy persona and shows 5 chips: Track my order, Returns &
      exchanges, Gear recommendations, Shipping info, Talk to a live agent

## 2. Order tracking (use case i), mock data exact

| Input | Expected |
|---|---|
| Type **"where's my order?"** (or *"track my package"*, *"wheres my stuff"*) | Bot asks for order number |
| **111** | **Shipped, arriving tomorrow** |
| Track again → **222** | **Processing, ships in 24 hours** |
| Track again → **333** | **Delivered** + follow-up question ("everything okay?"), answer **yes** → offered returns/live agent; answer **no** → back to menu |
| Track again → **999** | Invalid order, polite retry + escalation options |
| While asked for a number, type **"I'm not sure"** | Re-prompt for order number (doesn't break) |
| One-shot: **"track order 222"** | Skips straight to status (number extracted) |

## 3. Returns & exchanges (use case ii)

- [ ] Click the **"↩️ Returns & exchanges"** chip: the bot asks whether you want a
      **return** or an **exchange** before showing any policy (natural progression)
- [ ] Pick **"Start a return"**: full return policy (30-day, unused, original
      packaging), the returns link, numbered steps, and a refund explanation
- [ ] Pick **"Make an exchange"** (or type "swap it"): full exchange policy with the
      link, "pick exchange" steps, and size/color selection
- [ ] Free text goes straight to the right one: **"what's your return policy?"** gives
      returns directly; **"my jacket is too small"** gives exchanges directly
- [ ] Ambiguous text (**"I want to return or exchange my boots"**) triggers the same
      clarifying question
- [ ] Bot returns to main menu options afterward

## 4. Product recommendations (use case iii)

- [ ] Say **"can you recommend some gear?"**
- [ ] Bot asks clarifying Q1 (activity), chips *and* free text (try typing "hiking") both work
- [ ] Bot asks clarifying Q2 (style/conditions)
- [ ] Bot recommends a product **category** with a short blurb, mentions shipping
      timelines, and returns to the main menu

## 5. Human handoff (use case iv)

- [ ] Say **"talk to a human"** (or *"live agent please"*, or click the chip)
- [ ] Clear handoff: header turns **navy**, avatar becomes **R**, title reads
      **Riley, Live Agent**, "Live agent connected" status pulses
- [ ] Send any message, the (simulated) agent responds; you can keep chatting
- [ ] Click **🏠 Main menu** (or type "main menu"), agent signs off, header returns
      to bot state, menu chips are back  ✅ *(checklist item vi)*
- [ ] Handoff also works mid-flow: start order tracking, then type
      *"actually, let me talk to a live agent"*

## 6. Fallback handling

- [ ] Type gibberish (e.g. **"flarp glorbin"**) → clear "didn't catch that" + option chips
- [ ] Type gibberish again → bot explicitly offers **live agent** escalation
- [ ] Pick any real option → works; strike counter resets

## 7. Shipping info (requirement 3.d.ii)

- [ ] Ask **"how long does shipping take?"** → Standard **3-5 business days**,
      Expedited **1-2 business days**

## 8. Demo storefront (staging around the bot)

- [ ] Nav works: Shop, FAQ, About, cart icon (hash routes, back/forward supported)
- [ ] Shop: filter chips narrow the grid (try ❄️ Winter)
- [ ] Product page: open any product, **Add to cart** bumps the badge and shows a toast
- [ ] Product page: **"Ask the bot about this"** opens the chat and sends a matching
      gear question automatically
- [ ] Cart: quantity steppers update the subtotal; **Checkout** shows the demo notice
- [ ] FAQ: each answer's **"Ask the bot"** button sends that question into the chat

## 9. Automated suite

```bash
npm test        # 110 tests, all engine logic
npm run build   # strict type-check + production build
```
