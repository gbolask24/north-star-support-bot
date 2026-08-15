import { describe, it, expect } from 'vitest';
import {
  detectIntent,
  extractOrderNumber,
  isAffirmative,
  isNegative,
} from '../src/engine/intents';

describe('intent recognition — phrasing variations (requirement 3.a)', () => {
  it.each([
    'Where is my order?',
    'track my package',
    'order status',
    'When will my order arrive?',
    'wheres my stuff',
    'Can you track order 111 for me?',
    'I want to check on my delivery',
  ])('order tracking: "%s"', (text) => {
    expect(detectIntent(text)).toBe('track_order');
  });

  it.each([
    'I want to return my boots',
    "What's your return policy?",
    'refund please',
    'How do I send this back?',
    'I want to return my order',
  ])('returns: "%s"', (text) => {
    expect(detectIntent(text)).toBe('returns');
  });

  it.each([
    'Can I exchange this jacket for a bigger size?',
    "What's your exchange policy?",
    'How do exchanges work?',
    'I need to swap this for a different size',
    'Can I swap this for another color?',
    'This is the wrong size, can I get a different one?',
  ])('exchanges: "%s"', (text) => {
    expect(detectIntent(text)).toBe('exchange');
  });

  it('routes the combined "Returns & exchanges" chip to returns (which covers both)', () => {
    expect(detectIntent('↩️ Returns & exchanges')).toBe('returns');
  });

  it.each([
    'Can you recommend a tent?',
    "I'm looking for a new jacket",
    'What should I buy for hiking?',
    'help me find a sleeping bag',
    'I need gear for camping',
    'any suggestions for winter gear?',
  ])('product recommendations: "%s"', (text) => {
    expect(detectIntent(text)).toBe('recommend');
  });

  it.each([
    'How long does shipping take?',
    'What are your shipping options?',
    'Do you offer expedited shipping?',
    'how fast is delivery?',
  ])('shipping info: "%s"', (text) => {
    expect(detectIntent(text)).toBe('shipping');
  });

  it.each([
    'I want to talk to a human',
    'live agent please',
    'Can I speak to a real person?',
    'agent',
    'Get me customer service',
    'representative',
  ])('human handoff: "%s"', (text) => {
    expect(detectIntent(text)).toBe('human');
  });

  it.each(['hi', 'Hello!', 'hey there', 'good morning'])(
    'greeting: "%s"',
    (text) => {
      expect(detectIntent(text)).toBe('greeting');
    },
  );

  it.each(['main menu', 'start over', 'go back to the menu'])(
    'menu: "%s"',
    (text) => {
      expect(detectIntent(text)).toBe('menu');
    },
  );

  it.each(['asdf qwerty zxcv', 'what is the meaning of life', '???'])(
    'unknown: "%s"',
    (text) => {
      expect(detectIntent(text)).toBe('unknown');
    },
  );

  it('prefers returns over tracking when both words appear', () => {
    expect(detectIntent('I want to return my order')).toBe('returns');
  });
});

describe('order number extraction', () => {
  it('extracts digits from natural phrases', () => {
    expect(extractOrderNumber('my order number is 111')).toBe('111');
    expect(extractOrderNumber('#222')).toBe('222');
    expect(extractOrderNumber('333')).toBe('333');
    expect(extractOrderNumber('order no. 987654')).toBe('987654');
  });

  it('returns null when no number present', () => {
    expect(extractOrderNumber('I have no idea')).toBeNull();
  });
});

describe('yes/no detection for follow-ups', () => {
  it.each(['yes', 'yeah', 'yep', 'sure', 'yes please'])(
    'affirmative: "%s"',
    (t) => expect(isAffirmative(t)).toBe(true),
  );
  it.each(['no', 'nope', 'no thanks', 'nah, all good'])(
    'negative: "%s"',
    (t) => expect(isNegative(t)).toBe(true),
  );
});
