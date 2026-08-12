// All business data provided in the project brief. Nothing here is invented
// beyond the brief's provided materials (constraint 5.b: use provided data only).

export interface OrderInfo {
  id: string;
  status: 'Shipped' | 'Processing' | 'Delivered';
  summary: string;
}

export interface ActivityOption {
  label: string;
  category: string;
  blurb: string;
}

export interface Activity {
  id: string;
  label: string;
  question: string;
  options: ActivityOption[];
}

export const STORE = {
  name: 'North Star Outfitters',
  botName: 'North Star Support Bot',
  returnsUrl: 'https://returns.northstar-outfitters.example.com',
};

const ORDERS: Record<string, OrderInfo> = {
  '111': {
    id: '111',
    status: 'Shipped',
    summary: "Great news — it's on its way and arriving tomorrow! 🎒",
  },
  '222': {
    id: '222',
    status: 'Processing',
    summary: "We're packing it up now — it ships in 24 hours.",
  },
  '333': {
    id: '333',
    status: 'Delivered',
    summary: 'It was delivered — hope it’s already out on the trail with you!',
  },
};

export function lookupOrder(id: string): OrderInfo | null {
  const digits = id.replace(/\D/g, '');
  return ORDERS[digits] ?? null;
}

export const RETURN_POLICY = {
  windowDays: 30,
  rules: [
    'You have **30 days** from delivery to start a return (30-day returns).',
    'Items must be **unused** — save the summit celebration until you’re sure!',
    'Please keep the **original packaging**.',
  ],
};

export const SHIPPING = {
  standard: '3–5 business days',
  expedited: '1–2 business days',
};

export const ACTIVITIES: Activity[] = [
  {
    id: 'hiking',
    label: '🥾 Hiking',
    question: 'Nice — day hikes or multi-day treks?',
    options: [
      {
        label: 'Day hikes',
        category: 'Trail Apparel & Daypacks',
        blurb: 'lightweight layers, trail shoes, and daypacks built for quick summits',
      },
      {
        label: 'Multi-day treks',
        category: 'Backpacking Packs & Trekking Gear',
        blurb: 'bigger packs, trekking poles, and durable apparel for the long haul',
      },
    ],
  },
  {
    id: 'camping',
    label: '⛺ Camping',
    question: 'Love it — car camping or backcountry?',
    options: [
      {
        label: 'Car camping',
        category: 'Family Tents & Camp Comfort',
        blurb: 'roomy tents, camp chairs, and cozy extras for basecamp living',
      },
      {
        label: 'Backcountry',
        category: 'Lightweight Tents & Sleep Systems',
        blurb: 'ultralight shelters and sleeping bags that won’t weigh you down',
      },
    ],
  },
  {
    id: 'winter',
    label: '❄️ Winter adventures',
    question: 'Brr — staying warm around town or hitting the slopes?',
    options: [
      {
        label: 'Around town',
        category: 'Insulated Jackets & Winter Layers',
        blurb: 'down and synthetic insulation to keep the cold where it belongs',
      },
      {
        label: 'On the slopes',
        category: 'Ski & Snowboard Outerwear',
        blurb: 'waterproof, breathable shells and bibs built for deep days',
      },
    ],
  },
  {
    id: 'rain',
    label: '🌧️ Rain protection',
    question: 'Good call — light drizzle or serious downpours?',
    options: [
      {
        label: 'Light drizzle',
        category: 'Rain Shells & Windbreakers',
        blurb: 'packable shells that live in your bag until the clouds roll in',
      },
      {
        label: 'Serious downpours',
        category: 'Waterproof Hardshells & Rain Gear',
        blurb: 'fully seam-sealed protection for when the sky really opens up',
      },
    ],
  },
];
