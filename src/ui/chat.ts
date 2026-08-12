// Chat widget controller: renders Conversation responses, simulates typing,
// and swaps the header into the Live Agent visual state during handoff.

import { Conversation, BotMessage } from '../engine/flows';
import { STORE } from '../engine/data';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Markdown-lite: **bold**, *italic*, bare URLs. Input is escaped first.
function renderText(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>',
    );
}

function timestamp(): string {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, REDUCED_MOTION ? 0 : ms));

export function initChat(): void {
  const launcher = el<HTMLButtonElement>('chat-launcher');
  const panel = el<HTMLElement>('chat-panel');
  const header = el<HTMLElement>('chat-header');
  const avatar = el<HTMLElement>('chat-avatar');
  const name = el<HTMLElement>('chat-name');
  const status = el<HTMLElement>('chat-status');
  const log = el<HTMLElement>('chat-log');
  const chipsBox = el<HTMLElement>('chat-chips');
  const form = el<HTMLFormElement>('chat-form');
  const input = el<HTMLInputElement>('chat-text');

  const convo = new Conversation();
  let started = false;
  let busy = false;

  const starSvg = avatar.innerHTML;

  function setAgentMode(on: boolean): void {
    header.classList.toggle('is-agent', on);
    if (on) {
      avatar.textContent = 'R';
      name.textContent = 'Riley — Live Agent';
      status.innerHTML = '<i class="dot"></i> Live agent connected';
    } else {
      avatar.innerHTML = starSvg;
      name.textContent = STORE.botName;
      status.innerHTML = '<i class="dot"></i> Usually replies instantly';
    }
  }

  function scrollToEnd(): void {
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(kind: 'bot' | 'agent' | 'user', text: string): void {
    const bubble = document.createElement('div');
    bubble.className = `msg msg-${kind}`;
    bubble.innerHTML = renderText(text);
    log.appendChild(bubble);

    const meta = document.createElement('div');
    meta.className = `msg-meta ${kind === 'user' ? 'meta-user' : 'meta-bot'}`;
    const who = kind === 'user' ? 'You' : kind === 'agent' ? 'Riley (live agent)' : STORE.botName;
    meta.textContent = `${who} · ${timestamp()}`;
    log.appendChild(meta);
    scrollToEnd();
  }

  function showTyping(): HTMLElement {
    const t = document.createElement('div');
    t.className = 'typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t);
    scrollToEnd();
    return t;
  }

  function renderChips(chips: string[]): void {
    chipsBox.innerHTML = '';
    for (const label of chips) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = label;
      b.addEventListener('click', () => send(label));
      chipsBox.appendChild(b);
    }
    scrollToEnd();
  }

  async function playResponse(messages: BotMessage[], chips: string[]): Promise<void> {
    busy = true;
    chipsBox.innerHTML = '';
    for (const m of messages) {
      const typing = showTyping();
      await delay(420 + Math.min(m.text.length * 6, 700));
      typing.remove();
      addMessage(m.sender, m.text);
      setAgentMode(convo.inLiveAgent);
      await delay(160);
    }
    renderChips(chips);
    busy = false;
    input.focus({ preventScroll: true });
  }

  async function send(text: string): Promise<void> {
    const clean = text.trim();
    if (!clean || busy) return;
    addMessage('user', clean);
    const response = convo.handle(clean);
    await playResponse(response.messages, response.chips);
  }

  function openPanel(): void {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    input.focus({ preventScroll: true });
    if (!started) {
      started = true;
      const r = convo.start();
      void playResponse(r.messages, r.chips);
    }
  }

  function closePanel(): void {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  el<HTMLButtonElement>('chat-close').addEventListener('click', closePanel);

  document.querySelectorAll<HTMLElement>('[data-open-chat]').forEach((node) => {
    node.addEventListener('click', openPanel);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (busy) return; // keep the text — don't swallow input mid-response
    const value = input.value;
    input.value = '';
    void send(value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
}
