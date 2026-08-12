// Tiny hash router. Keeps the store a single self-contained HTML file
// while behaving like a multi-page site (back/forward, shareable URLs).

export type Route =
  | { name: 'home' }
  | { name: 'shop'; filter: string }
  | { name: 'product'; id: string }
  | { name: 'faq' }
  | { name: 'about' }
  | { name: 'cart' };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  const [head, param] = clean.split('/');
  switch (head) {
    case '':
    case 'home':
      return { name: 'home' };
    case 'shop':
      return { name: 'shop', filter: param || 'all' };
    case 'product':
      return param ? { name: 'product', id: param } : { name: 'shop', filter: 'all' };
    case 'faq':
      return { name: 'faq' };
    case 'about':
      return { name: 'about' };
    case 'cart':
      return { name: 'cart' };
    default:
      return { name: 'home' };
  }
}

export function onRouteChange(handler: (route: Route) => void): void {
  const fire = () => handler(parseHash(window.location.hash));
  window.addEventListener('hashchange', fire);
  fire(); // initial route
}
