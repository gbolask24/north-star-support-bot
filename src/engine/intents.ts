// Deterministic intent recognition: normalized text scored against weighted
// keyword/phrase patterns. No external NLP: fully predictable and testable.

export type Intent =
  | 'track_order'
  | 'returns'
  | 'exchange'
  | 'recommend'
  | 'shipping'
  | 'human'
  | 'greeting'
  | 'thanks'
  | 'goodbye'
  | 'menu'
  | 'unknown';

interface Pattern {
  re: RegExp;
  weight: number;
}

const p = (re: RegExp, weight: number): Pattern => ({ re, weight });

const PATTERNS: Record<Exclude<Intent, 'unknown'>, Pattern[]> = {
  track_order: [
    p(/\btrack(ing)?\b/, 3),
    p(/\bwhere('| i)?s? (is )?my (order|package|stuff|delivery|parcel)\b/, 4),
    p(/\border status\b/, 4),
    p(/\bstatus of my (order|package|delivery)\b/, 4),
    p(/\bwhen will my (order|package|stuff|gear) (arrive|get here|come)\b/, 4),
    p(/\bcheck on my (order|package|delivery)\b/, 4),
    p(/\bmy (order|package|parcel)\b/, 1),
  ],
  returns: [
    p(/\breturns?\b/, 3),
    p(/\brefunds?\b/, 3),
    p(/\bsend (it|this|them) back\b/, 4),
    p(/\bmoney back\b/, 3),
    p(/\btake (it|this) back\b/, 3),
  ],
  // Defined after `returns` so the combined "Returns & exchanges" chip
  // resolves to the combined returns response on a tie.
  exchange: [
    p(/\bexchanges?\b/, 3),
    p(/\bexchange policy\b/, 4),
    p(/\bswap\b/, 3),
    p(/\b(different|bigger|smaller|larger|another|wrong) (size|colou?r|fit)\b/, 3),
    p(/\bsize (up|down)\b/, 3),
    p(/\btrade (it |this )?in\b/, 3),
  ],
  recommend: [
    p(/\brecommend(ation)?s?\b/, 3),
    p(/\bsuggest(ion)?s?\b/, 3),
    p(/\blooking for\b/, 3),
    p(/\bhelp me (find|pick|choose)\b/, 3),
    p(/\bwhat should i (buy|get|wear|bring)\b/, 4),
    p(/\bshopping for\b/, 3),
    p(/\bi need (a|an|some|new)\b/, 2),
    p(/\bgear for\b/, 3),
    p(/\bin the market for\b/, 3),
  ],
  shipping: [
    p(/\bshipping\b/, 3),
    p(/\bhow long does (shipping|delivery) take\b/, 4),
    p(/\bdelivery (options|time|speed)\b/, 4),
    p(/\bhow fast is (shipping|delivery)\b/, 4),
    p(/\bexpedited?\b/, 3),
    p(/\bship (times?|options?)\b/, 3),
  ],
  human: [
    p(/\b(live|real) (agent|person|human|rep)\b/, 4),
    p(/\bhumans?\b/, 3),
    p(/\bagents?\b/, 3),
    p(/\brepresentatives?\b/, 3),
    p(/\bcustomer (service|support)\b/, 3),
    p(/\b(talk|speak|chat) (to|with) (a |an |some)?(person|someone|somebody)\b/, 4),
    p(/\breal person\b/, 4),
    p(/\boperator\b/, 3),
  ],
  greeting: [
    p(/^(hi|hiya|hello|hey|howdy|yo)\b/, 3),
    p(/^good (morning|afternoon|evening)\b/, 3),
  ],
  thanks: [p(/\bthank(s| you)?\b/, 3), p(/\bappreciate\b/, 3), p(/^cheers\b/, 3)],
  goodbye: [p(/^(bye|goodbye|good bye|see ya|later|farewell)\b/, 3)],
  menu: [
    p(/\b(main )?menu\b/, 4),
    p(/\bstart over\b/, 4),
    p(/\bgo back\b/, 3),
    p(/\brestart\b/, 3),
  ],
};

// Minimum score to claim an intent, a single weak keyword is not enough.
const THRESHOLD = 2;

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'#\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectIntent(text: string): Intent {
  const t = normalize(text);
  if (!t) return 'unknown';

  let best: Intent = 'unknown';
  let bestScore = 0;
  for (const [intent, patterns] of Object.entries(PATTERNS) as [
    Exclude<Intent, 'unknown'>,
    Pattern[],
  ][]) {
    let score = 0;
    for (const { re, weight } of patterns) {
      if (re.test(t)) score += weight;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return bestScore >= THRESHOLD ? best : 'unknown';
}

export function extractOrderNumber(text: string): string | null {
  const match = normalize(text).match(/\d+/);
  return match ? match[0] : null;
}

export function isAffirmative(text: string): boolean {
  return /^(y(es|ep|eah|up|a)?|sure|ok(ay)?|please|definitely|absolutely|of course|sounds good)\b/.test(
    normalize(text),
  );
}

export function isNegative(text: string): boolean {
  return /\b(no|nope|nah|not really|no thanks|all good|i'?m good|all set)\b/.test(
    normalize(text),
  );
}
