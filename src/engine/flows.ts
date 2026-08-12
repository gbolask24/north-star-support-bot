// Conversation state machine. Every resolved flow returns the user to the
// main flow (requirement 3.b.ii). Fallback is two-strike: clarify, then
// offer escalation (3.e.ii). Live Agent is a distinct state the user can
// leave at any time via the main menu (3.e.i).

import {
  ACTIVITIES,
  Activity,
  lookupOrder,
  RETURN_POLICY,
  SHIPPING,
  STORE,
} from './data';
import {
  detectIntent,
  extractOrderNumber,
  Intent,
  isAffirmative,
  isNegative,
  normalize,
} from './intents';

export type Sender = 'bot' | 'agent';

export interface BotMessage {
  sender: Sender;
  text: string;
}

export interface BotResponse {
  messages: BotMessage[];
  chips: string[];
}

export const CHIPS = {
  track: '📦 Track my order',
  returns: '↩️ Returns & exchanges',
  recommend: '🧭 Gear recommendations',
  shipping: '🚚 Shipping info',
  agent: '💬 Talk to a live agent',
  menu: '🏠 Main menu',
  endChat: '✅ End chat with agent',
  tryAgain: '🔁 Try another order number',
  yesHelp: 'Yes, I need a hand',
  noGood: 'No, all good!',
};

const MENU_CHIPS = [
  CHIPS.track,
  CHIPS.returns,
  CHIPS.recommend,
  CHIPS.shipping,
  CHIPS.agent,
];

type State =
  | 'MENU'
  | 'AWAIT_ORDER'
  | 'ORDER_FOLLOWUP'
  | 'RECO_ACTIVITY'
  | 'RECO_OPTION'
  | 'LIVE_AGENT';

const bot = (text: string): BotMessage => ({ sender: 'bot', text });
const agent = (text: string): BotMessage => ({ sender: 'agent', text });

const ANYTHING_ELSE = 'Anything else I can help you with?';

export class Conversation {
  private state: State = 'MENU';
  private strikes = 0;
  private activity: Activity | null = null;

  get inLiveAgent(): boolean {
    return this.state === 'LIVE_AGENT';
  }

  start(): BotResponse {
    this.state = 'MENU';
    return {
      messages: [
        bot(
          `Hey there, happy trails! 🏔️ I'm the **${STORE.botName}** for ${STORE.name}.`,
        ),
        bot(
          'I can help you track an order, sort out returns & exchanges, find the right gear, or connect you with a live agent. What can I do for you?',
        ),
      ],
      chips: MENU_CHIPS,
    };
  }

  handle(input: string): BotResponse {
    const intent = detectIntent(input);

    // Global escapes work from any state.
    if (intent === 'menu') return this.gotoMenu();
    if (intent === 'human' && this.state !== 'LIVE_AGENT') {
      return this.handoff();
    }

    switch (this.state) {
      case 'AWAIT_ORDER':
        return this.awaitOrder(input, intent);
      case 'ORDER_FOLLOWUP':
        return this.orderFollowup(input, intent);
      case 'RECO_ACTIVITY':
        return this.recoActivity(input, intent);
      case 'RECO_OPTION':
        return this.recoOption(input, intent);
      case 'LIVE_AGENT':
        return this.liveAgent(input);
      case 'MENU':
        return this.route(input, intent);
    }
  }

  // ---- Routing from the main flow ----------------------------------------

  private route(input: string, intent: Intent): BotResponse {
    switch (intent) {
      case 'track_order':
        return this.trackStart(input);
      case 'returns':
        return this.returnsInfo();
      case 'shipping':
        return this.shippingInfo();
      case 'recommend':
        return this.recoStart();
      case 'human':
        return this.handoff();
      case 'greeting':
        this.resetToMenu();
        return {
          messages: [bot('Hey hey! 👋 Great to see you. What can I help you with today?')],
          chips: MENU_CHIPS,
        };
      case 'thanks':
        this.resetToMenu();
        return {
          messages: [bot("You're so welcome, that's what I'm here for! 🌲 " + ANYTHING_ELSE)],
          chips: MENU_CHIPS,
        };
      case 'goodbye':
        this.resetToMenu();
        return {
          messages: [bot('Happy trails out there! 🏕️ Come back any time you need a hand.')],
          chips: MENU_CHIPS,
        };
      case 'menu':
        return this.gotoMenu();
      case 'unknown':
      default:
        return this.fallback();
    }
  }

  private gotoMenu(): BotResponse {
    const fromAgent = this.state === 'LIVE_AGENT';
    this.resetToMenu();
    const messages = fromAgent
      ? [
          agent('Thanks for chatting! Passing you back to our trusty bot. Take care out there! 👋'),
          bot("I'm back! 🤖 " + ANYTHING_ELSE),
        ]
      : [bot('Back to base camp! ⛺ ' + ANYTHING_ELSE)];
    return { messages, chips: MENU_CHIPS };
  }

  private resetToMenu(): void {
    this.state = 'MENU';
    this.strikes = 0;
    this.activity = null;
  }

  // ---- Use case i: order tracking -----------------------------------------

  private trackStart(input: string): BotResponse {
    const num = extractOrderNumber(input);
    if (num) return this.orderStatus(num);
    this.state = 'AWAIT_ORDER';
    this.strikes = 0;
    return {
      messages: [
        bot("Happy to check on that for you! 📦 What's your order number?"),
      ],
      chips: [CHIPS.menu],
    };
  }

  private awaitOrder(input: string, intent: Intent): BotResponse {
    const num = extractOrderNumber(input);
    if (num) return this.orderStatus(num);
    // No number: maybe they changed their mind and asked for something else.
    if (intent !== 'unknown' && intent !== 'track_order' && intent !== 'greeting') {
      return this.route(input, intent);
    }
    return {
      messages: [
        bot("No worries! It's the number on your order confirmation email. What's your order number?"),
      ],
      chips: [CHIPS.agent, CHIPS.menu],
    };
  }

  private orderStatus(num: string): BotResponse {
    const order = lookupOrder(num);
    if (!order) {
      this.state = 'AWAIT_ORDER';
      return {
        messages: [
          bot(
            `Hmm, I couldn't find an order **#${num}** in our system. 🤔 Mind double-checking the number and trying again?`,
          ),
        ],
        chips: [CHIPS.tryAgain, CHIPS.agent, CHIPS.menu],
      };
    }
    if (order.status === 'Delivered') {
      this.state = 'ORDER_FOLLOWUP';
      return {
        messages: [
          bot(`Order **#${order.id}**: **Delivered** ✅. ${order.summary}`),
          bot('Is everything looking good with it, or do you need a hand with anything?'),
        ],
        chips: [CHIPS.yesHelp, CHIPS.noGood],
      };
    }
    this.resetToMenu();
    const emoji = order.status === 'Shipped' ? '🚚' : '📦';
    return {
      messages: [
        bot(`Order **#${order.id}**: **${order.status}** ${emoji}. ${order.summary}`),
        bot(ANYTHING_ELSE),
      ],
      chips: MENU_CHIPS,
    };
  }

  private orderFollowup(input: string, intent: Intent): BotResponse {
    if (isNegative(input)) {
      this.resetToMenu();
      return {
        messages: [bot('Music to my ears! 🎉 ' + ANYTHING_ELSE)],
        chips: MENU_CHIPS,
      };
    }
    if (isAffirmative(input)) {
      this.resetToMenu();
      return {
        messages: [
          bot("Sorry to hear something's off. Let's get it sorted! I can walk you through a return or exchange, or connect you with a live agent."),
        ],
        chips: [CHIPS.returns, CHIPS.agent, CHIPS.menu],
      };
    }
    if (intent !== 'unknown') return this.route(input, intent);
    this.resetToMenu();
    return {
      messages: [
        bot("Got it! If anything comes up with that order, I'm right here. I can help with a return or connect you with a live agent."),
      ],
      chips: [CHIPS.returns, CHIPS.agent, CHIPS.menu],
    };
  }

  // ---- Use case ii: returns & exchanges -----------------------------------

  private returnsInfo(): BotResponse {
    this.resetToMenu();
    return {
      messages: [
        bot("Of course! Here's how returns & exchanges work at North Star: 🧾"),
        bot(RETURN_POLICY.rules.map((r) => `• ${r}`).join('\n')),
        bot(
          `When you're ready, start your return here: ${STORE.returnsUrl}\n\nExchanges work the same way. Just pick "exchange" on that page and we'll get the right size or color headed your way.`,
        ),
        bot(ANYTHING_ELSE),
      ],
      chips: MENU_CHIPS,
    };
  }

  // ---- Requirement 3.d.ii: shipping info -----------------------------------

  private shippingInfo(): BotResponse {
    this.resetToMenu();
    return {
      messages: [
        bot(
          `Here's the lay of the land for shipping: 🚚\n• **Standard shipping:** ${SHIPPING.standard}\n• **Expedited shipping:** ${SHIPPING.expedited}`,
        ),
        bot(ANYTHING_ELSE),
      ],
      chips: MENU_CHIPS,
    };
  }

  // ---- Use case iii: product recommendations ------------------------------

  private recoStart(): BotResponse {
    this.state = 'RECO_ACTIVITY';
    this.strikes = 0;
    return {
      messages: [
        bot("Now we're talking! Let's find you the right gear. 🧭 What kind of adventure are you gearing up for?"),
      ],
      chips: [...ACTIVITIES.map((a) => a.label), CHIPS.menu],
    };
  }

  private matchActivity(input: string): Activity | null {
    const t = normalize(input);
    return (
      ACTIVITIES.find(
        (a) => t.includes(a.id) || normalize(a.label).split(' ').some((w) => w.length > 3 && t.includes(w)),
      ) ?? null
    );
  }

  private recoActivity(input: string, intent: Intent): BotResponse {
    const activity = this.matchActivity(input);
    if (activity) {
      this.activity = activity;
      this.state = 'RECO_OPTION';
      return {
        messages: [bot(activity.question)],
        chips: [...activity.options.map((o) => o.label), CHIPS.menu],
      };
    }
    if (intent !== 'unknown' && intent !== 'recommend') return this.route(input, intent);
    return {
      messages: [
        bot("I want to point you to the right trail. Pick the adventure that fits best: 🗺️"),
      ],
      chips: [...ACTIVITIES.map((a) => a.label), CHIPS.menu],
    };
  }

  private recoOption(input: string, intent: Intent): BotResponse {
    const activity = this.activity;
    if (!activity) return this.recoStart();
    const t = normalize(input);
    const option =
      activity.options.find((o) => normalize(o.label).split(' ').some((w) => w.length > 2 && t.includes(w))) ??
      null;
    if (option) {
      this.resetToMenu();
      return {
        messages: [
          bot(
            `Perfect! I'd recommend checking out our **${option.category}** 🎯: ${option.blurb}.`,
          ),
          bot(
            `Heads up: standard shipping takes ${SHIPPING.standard}, or ${SHIPPING.expedited} expedited if the trail can't wait. ${ANYTHING_ELSE}`,
          ),
        ],
        chips: MENU_CHIPS,
      };
    }
    if (intent !== 'unknown' && intent !== 'recommend') return this.route(input, intent);
    return {
      messages: [bot(activity.question)],
      chips: [...activity.options.map((o) => o.label), CHIPS.menu],
    };
  }

  // ---- Use case iv: human handoff ------------------------------------------

  private handoff(): BotResponse {
    this.state = 'LIVE_AGENT';
    this.strikes = 0;
    return {
      messages: [
        bot('You got it! Connecting you with a live agent now… 🔄'),
        agent(
          `Hi there, you're now chatting with **Riley** from ${STORE.name} support! 👋 I can see your conversation so far. What can I help you with?`,
        ),
      ],
      chips: [CHIPS.menu, CHIPS.endChat],
    };
  }

  private liveAgent(input: string): BotResponse {
    const t = normalize(input);
    if (t.includes('end chat')) return this.gotoMenu();
    return {
      messages: [
        agent(
          "Thanks for the details! I've made a note on your account and I'm on it. *(Simulated live agent for this demo.)* Anything else you'd like to add?",
        ),
      ],
      chips: [CHIPS.menu, CHIPS.endChat],
    };
  }

  // ---- Requirement 3.e.ii: fallback ----------------------------------------

  private fallback(): BotResponse {
    this.strikes += 1;
    if (this.strikes >= 2) {
      return {
        messages: [
          bot("I'm still not quite following, sorry about that! 🙇 Want me to connect you with a live agent? Or pick one of these and we'll get back on track:"),
        ],
        chips: [CHIPS.agent, ...MENU_CHIPS.filter((c) => c !== CHIPS.agent)],
      };
    }
    return {
      messages: [
        bot("Hmm, I didn't quite catch that! 🧭 I'm best with order tracking, returns & exchanges, gear recommendations, and shipping questions. What would you like to do?"),
      ],
      chips: MENU_CHIPS,
    };
  }
}
