// Store controller: routing, cart state, toasts, and delegated interactions.

import { add, count, loadCart, remove, saveCart, setQty } from './cart';
import { productById } from './catalog';
import { onRouteChange, parseHash, Route } from './router';
import { renderRoute } from './views';
import type { ChatController } from '../ui/chat';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

export function initStore(chat: ChatController): void {
  const app = el<HTMLElement>('app');
  const badge = el<HTMLElement>('cart-badge');
  let lines = loadCart();
  let route: Route = parseHash(window.location.hash);

  // ---- cart -----------------------------------------------------------------

  function updateBadge(): void {
    const n = count(lines);
    badge.textContent = String(n);
    badge.classList.toggle('is-empty', n === 0);
  }

  function mutateCart(next: typeof lines, message?: string): void {
    lines = next;
    saveCart(lines);
    updateBadge();
    if (message) toast(message);
    if (route.name === 'cart') render(route, false);
  }

  // ---- rendering --------------------------------------------------------------

  function render(next: Route, scrollTop = true): void {
    route = next;
    const { html, title } = renderRoute(route, lines);
    app.innerHTML = html;
    document.title = title;
    if (scrollTop) window.scrollTo({ top: 0, behavior: 'auto' });
    updateNav();
    observeReveals();
  }

  function updateNav(): void {
    document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
      a.classList.toggle('is-active', a.dataset.nav === route.name);
    });
  }

  // ---- scroll reveal ------------------------------------------------------------

  const observer = REDUCED_MOTION
    ? null
    : new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 },
      );

  function observeReveals(): void {
    if (!observer) {
      document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-revealed'));
      return;
    }
    document.querySelectorAll('.reveal:not(.is-revealed)').forEach((n) => observer.observe(n));
  }

  // ---- toast ---------------------------------------------------------------------

  let toastTimer: number | undefined;
  function toast(message: string): void {
    let node = document.getElementById('toast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'toast';
      node.setAttribute('role', 'status');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node?.classList.remove('is-visible'), 2200);
  }

  // ---- delegated interactions ------------------------------------------------------

  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-add], [data-qty], [data-remove], [data-ask], [data-checkout]',
    );
    if (!target) return;

    if (target.dataset.add) {
      const p = productById(target.dataset.add);
      if (p) mutateCart(add(lines, p.id), `Added ${p.name} to your pack ⭐`);
      return;
    }
    if (target.dataset.qty) {
      const [id, qtyRaw] = target.dataset.qty.split(':');
      mutateCart(setQty(lines, id, Number(qtyRaw)));
      return;
    }
    if (target.dataset.remove) {
      const p = productById(target.dataset.remove);
      mutateCart(remove(lines, target.dataset.remove), p ? `Removed ${p.name}` : undefined);
      return;
    }
    if (target.dataset.ask) {
      chat.ask(target.dataset.ask);
      return;
    }
    if (target.hasAttribute('data-checkout')) {
      toast('Demo store: checkout is simulated. Your gear stays imaginary ⭐');
      return;
    }
  });

  // ---- go ---------------------------------------------------------------------------

  updateBadge();
  onRouteChange((next) => render(next));
}
