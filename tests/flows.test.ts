import { describe, it, expect, beforeEach } from 'vitest';
import { Conversation } from '../src/engine/flows';

const allText = (r: { messages: { text: string }[] }) =>
  r.messages.map((m) => m.text).join(' ').toLowerCase();

let convo: Conversation;
beforeEach(() => {
  convo = new Conversation();
  convo.start();
});

describe('welcome & main menu', () => {
  it('greets and offers the four core options as chips', () => {
    const c = new Conversation();
    const r = c.start();
    expect(allText(r)).toContain('north star');
    const chips = r.chips.join(' ').toLowerCase();
    expect(chips).toContain('track');
    expect(chips).toContain('return');
    expect(chips).toContain('recommend');
    expect(chips).toContain('live agent');
  });
});

describe('order tracking flow (use case i)', () => {
  it('asks for the order number', () => {
    const r = convo.handle('track my package');
    expect(allText(r)).toContain('order number');
  });

  it('order 111 → shipped, arriving tomorrow, then back to main flow', () => {
    convo.handle('where is my order');
    const r = convo.handle('111');
    const text = allText(r);
    expect(text).toContain('shipped');
    expect(text).toContain('tomorrow');
    expect(r.chips.length).toBeGreaterThan(0); // returned to main flow options
  });

  it('order 222 → processing, ships in 24 hours', () => {
    convo.handle('track my order');
    const text = allText(convo.handle('#222'));
    expect(text).toContain('processing');
    expect(text).toContain('24 hours');
  });

  it('order 333 → delivered, asks a follow-up', () => {
    convo.handle('track order');
    const text = allText(convo.handle('333'));
    expect(text).toContain('delivered');
    expect(text).toMatch(/\?/); // asks follow-up
  });

  it('order 333 follow-up: yes → offers help options', () => {
    convo.handle('track order');
    convo.handle('333');
    const r = convo.handle('yes');
    expect(r.chips.join(' ').toLowerCase()).toMatch(/return|agent/);
  });

  it('order 333 follow-up: no → back to main menu', () => {
    convo.handle('track order');
    convo.handle('333');
    const r = convo.handle('no thanks');
    expect(r.chips.join(' ').toLowerCase()).toContain('track');
  });

  it('any other order number → invalid, offers retry', () => {
    convo.handle('track my order');
    const r = convo.handle('999');
    const text = allText(r);
    expect(text).toMatch(/couldn.t find|not find|invalid/);
    expect(r.chips.length).toBeGreaterThan(0);
  });

  it('re-prompts when no order number is given', () => {
    convo.handle('track my order');
    const r = convo.handle('I am not sure where it is');
    expect(allText(r)).toContain('order number');
  });

  it('lets the user switch intent instead of giving a number', () => {
    convo.handle('track my order');
    const r = convo.handle('actually, let me talk to a live agent');
    expect(convo.inLiveAgent).toBe(true);
    expect(allText(r)).toMatch(/agent/);
  });
});

describe('returns & exchanges flow (use case ii)', () => {
  it('explains the full policy and provides the returns link', () => {
    const r = convo.handle('what is your return policy?');
    const text = allText(r);
    expect(text).toMatch(/30[- ]day/);
    expect(text).toContain('unused');
    expect(text).toContain('original packaging');
    expect(text).toMatch(/https?:\/\//);
  });

  it('returns the user to the main flow afterward', () => {
    const r = convo.handle('I want to return my boots');
    expect(r.chips.length).toBeGreaterThan(0);
  });
});

describe('shipping info (requirement 3.d.ii)', () => {
  it('gives standard and expedited timelines', () => {
    const text = allText(convo.handle('how long does shipping take?'));
    expect(text).toMatch(/standard/);
    expect(text).toMatch(/3\s*[–-]\s*5 business days/);
    expect(text).toMatch(/expedited/);
    expect(text).toMatch(/1\s*[–-]\s*2 business days/);
  });
});

describe('product recommendations flow (use case iii)', () => {
  it('asks a clarifying question about activity', () => {
    const r = convo.handle('can you recommend some gear?');
    expect(r.chips.length).toBeGreaterThanOrEqual(3);
    expect(allText(r)).toMatch(/\?/);
  });

  it('asks a second clarifying question, then recommends a category', () => {
    const r1 = convo.handle('I need a recommendation');
    const activity = r1.chips[0];
    const r2 = convo.handle(activity);
    expect(allText(r2)).toMatch(/\?/); // second clarifying question
    const r3 = convo.handle(r2.chips[0]);
    expect(allText(r3)).toMatch(/recommend|check out|look at/);
    expect(r3.chips.length).toBeGreaterThan(0); // back to main flow
  });

  it('handles free-text answers to the activity question', () => {
    convo.handle('recommend me something');
    const r = convo.handle('hiking');
    expect(allText(r)).toMatch(/\?/);
  });
});

describe('human handoff (use case iv)', () => {
  it('transitions to live agent on explicit request', () => {
    const r = convo.handle('I want to talk to a human');
    expect(convo.inLiveAgent).toBe(true);
    const text = allText(r);
    expect(text).toMatch(/agent/);
    expect(r.messages.some((m) => m.sender === 'agent')).toBe(true);
  });

  it('user can keep chatting with the agent after handoff', () => {
    convo.handle('live agent please');
    const r = convo.handle('my tent arrived with a broken pole');
    expect(convo.inLiveAgent).toBe(true);
    expect(r.messages.some((m) => m.sender === 'agent')).toBe(true);
  });

  it('user can return to the main menu after handoff', () => {
    convo.handle('live agent please');
    const r = convo.handle('main menu');
    expect(convo.inLiveAgent).toBe(false);
    expect(r.chips.join(' ').toLowerCase()).toContain('track');
  });
});

describe('fallback handling (requirement 3.e.ii)', () => {
  it('first miss: clear "did not understand" + options', () => {
    const r = convo.handle('blorp flurble');
    const text = allText(r);
    expect(text).toMatch(/didn.t (quite )?(catch|understand|get)/);
    expect(r.chips.length).toBeGreaterThan(0);
  });

  it('second consecutive miss: offers live agent escalation', () => {
    convo.handle('blorp flurble');
    const r = convo.handle('gnarp gnarp');
    expect(r.chips.join(' ').toLowerCase()).toContain('live agent');
  });

  it('strike counter resets after a successful interaction', () => {
    convo.handle('blorp flurble');
    convo.handle('what is your return policy'); // success resets
    const r = convo.handle('blorp again');
    expect(allText(r)).toMatch(/didn.t (quite )?(catch|understand|get)/);
  });
});

describe('conversation flow (requirement 3.b)', () => {
  it('every resolved flow ends with chips to continue', () => {
    const flows = [
      ['what is your return policy?'],
      ['how long is shipping?'],
      ['track my order', '111'],
    ];
    for (const steps of flows) {
      const c = new Conversation();
      c.start();
      let last;
      for (const s of steps) last = c.handle(s);
      expect(last!.chips.length).toBeGreaterThan(0);
    }
  });
});
