# 🎬 Video Demo Script, North Star Support Bot

**Target length:** 2:30 (safely inside the 2-3 minute window)
**Setup before recording:** open the live URL in a clean browser window (hide bookmarks
bar), page at the top of the storefront, chat closed. Screen record at 1080p+
(QuickTime: File → New Screen Recording, or Loom). One take is realistic, the bot is
deterministic, so it behaves identically every run. Practice once, then record.

> Tip: speak ~10% slower than feels natural. The timings below have slack built in.

---

### 0:00 - 0:15, Intro (storefront visible)

**Say:** "Hi, this is my customer support chatbot for North Star Outfitters, a fictional
outdoor gear store. It's a self-contained web app, no API keys or accounts needed to
test it. It handles four core use cases: order tracking, returns, product
recommendations, and human handoff. Let's walk through all of them."

**Do:** slow scroll down the storefront and back up, then click the ⭐ chat bubble.

### 0:15 - 0:50, Use case 1: Order tracking (with intent variation)

**Say:** "First, order tracking. I'll type it the way a real customer would, notice
I'm not using a menu button."

**Do:** type **wheres my package??** → bot asks for order number → type **111**.

**Say:** "Order 111 comes back as shipped, arriving tomorrow. Order 222 shows
processing, shipping within 24 hours, and an invalid number is handled politely."

**Do:** click **📦 Track my order** → type **222** → then track again → type **999**
(show the invalid-order message).

### 0:50 - 1:10, Use case 2: Returns & exchanges

**Say:** "Next, returns. The bot explains the full policy, 30-day returns, items
unused, original packaging, and hands over the returns link. Then it brings me right
back to the main menu."

**Do:** type **what's your return policy?**, let the messages play, point out the link.

### 1:10 - 1:40, Use case 3: Product recommendations

**Say:** "For recommendations, it asks two quick clarifying questions, then points me
to a product category."

**Do:** click **🧭 Gear recommendations** → type **hiking** (free text, not the chip)
→ click **Day hikes** → recommendation appears.

**Say:** "Free text and buttons both work at every step."

### 1:40 - 2:10, Use case 4: Human handoff + return to menu

**Say:** "Now the human handoff. I'll ask for a person directly."

**Do:** type **talk to a human**.

**Say:** "The whole chat visibly changes state, navy header, 'Riley, Live Agent',
live status. I can keep chatting with the agent…"

**Do:** type **my tent arrived with a broken pole** → agent replies.

**Say:** "…and when I'm done, one tap returns me to the bot's main menu."

**Do:** click **🏠 Main menu**, show the header flipping back and menu chips returning.

### 2:10 - 2:25, Fallback scenario (required)

**Say:** "Finally, fallback handling. If the bot doesn't understand, it says so clearly
and offers options, and on a second miss, it proactively offers a live agent."

**Do:** type **flarp glorbin** → first fallback → type **quibble zorp** → escalation
offer appears.

### 2:25 - 2:35, Close

**Say:** "That's all four use cases plus fallback. Under the hood it's a TypeScript
state machine with a deterministic intent engine and 93 automated tests, so evaluators
get identical behavior every run. Thanks for watching!"

**Do:** (optional) 2-second cut to the README requirements table.

---

## Shot checklist (must appear on screen)

- [x] Order tracking: 111 ✚ 222 ✚ invalid 999, asked via free text *and* chip
- [x] Returns: full policy + link
- [x] Recommendations: two clarifying questions → category
- [x] Handoff: visual Live Agent state, chatting with agent, **return to main menu**
- [x] Fallback: "didn't catch that" + second-strike live-agent offer
