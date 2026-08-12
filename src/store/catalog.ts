// Demo storefront catalog. Purely presentational staging for the chatbot:
// the bot itself only ever quotes data provided in the project brief.

export type Motif =
  | 'tent'
  | 'pack'
  | 'jacket'
  | 'tee'
  | 'rain'
  | 'bag'
  | 'poles'
  | 'chair';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // matches a bot recommendation category
  activityId: 'hiking' | 'camping' | 'winter' | 'rain';
  motif: Motif;
  blurb: string;
  detail: string;
}

export const FILTERS: { id: Product['activityId'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All gear' },
  { id: 'hiking', label: '🥾 Hiking' },
  { id: 'camping', label: '⛺ Camping' },
  { id: 'winter', label: '❄️ Winter' },
  { id: 'rain', label: '🌧️ Rain' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'switchback-tee',
    name: 'Switchback Trail Tee',
    price: 34,
    category: 'Trail Apparel & Daypacks',
    activityId: 'hiking',
    motif: 'tee',
    blurb: 'Quick-dry knit for big-mile days.',
    detail:
      'A featherweight trail tee that wicks fast, resists odor, and moves with you on every switchback. Flatlock seams play nice with pack straps.',
  },
  {
    id: 'ridgeline-daypack',
    name: 'Ridgeline Daypack 22L',
    price: 89,
    category: 'Trail Apparel & Daypacks',
    activityId: 'hiking',
    motif: 'pack',
    blurb: 'Just-right size for summit days.',
    detail:
      'Twenty-two liters of smartly organized space: stretch side pockets, a zippered lid stash, and a back panel that breathes on the climb.',
  },
  {
    id: 'longhaul-65',
    name: 'Longhaul 65L Pack',
    price: 249,
    category: 'Backpacking Packs & Trekking Gear',
    activityId: 'hiking',
    motif: 'pack',
    blurb: 'Carries a week like a weekend.',
    detail:
      'Our multi-day hauler with an adjustable torso, load-lifter straps, and a hip belt that actually transfers weight. Built for the long haul.',
  },
  {
    id: 'summit-poles',
    name: 'Summit Carbon Trekking Poles',
    price: 119,
    category: 'Backpacking Packs & Trekking Gear',
    activityId: 'hiking',
    motif: 'poles',
    blurb: 'Featherlight, knee-saving.',
    detail:
      'Carbon shafts, foam grips, and flick locks that hold. Your knees will thank you on the descent.',
  },
  {
    id: 'basecamp-6',
    name: 'Basecamp 6-Person Tent',
    price: 329,
    category: 'Family Tents & Camp Comfort',
    activityId: 'camping',
    motif: 'tent',
    blurb: 'Standing room for the whole crew.',
    detail:
      'Near-vertical walls, two doors, and a vestibule big enough for muddy boots and a cooler. Weekend basecamp, solved.',
  },
  {
    id: 'ember-chair',
    name: 'Ember Camp Chair',
    price: 59,
    category: 'Family Tents & Camp Comfort',
    activityId: 'camping',
    motif: 'chair',
    blurb: 'Front-row seat to the campfire.',
    detail:
      'Low-slung comfort with a cupholder and a pocket for marshmallow skewers. Folds down to the size of a sleeping pad.',
  },
  {
    id: 'firefly-2p',
    name: 'Firefly 2P Ultralight Tent',
    price: 189,
    category: 'Lightweight Tents & Sleep Systems',
    activityId: 'camping',
    motif: 'tent',
    blurb: 'Two pounds, two people, zero fuss.',
    detail:
      'A backcountry shelter that pitches in minutes and disappears into your pack. Full mesh body for star-gazing on clear nights.',
  },
  {
    id: 'drift-20',
    name: 'Drift 20°F Down Bag',
    price: 229,
    category: 'Lightweight Tents & Sleep Systems',
    activityId: 'camping',
    motif: 'bag',
    blurb: 'Warmth that packs down tiny.',
    detail:
      'Responsibly sourced 800-fill down, a draft collar that seals in heat, and a footbox with room to wiggle.',
  },
  {
    id: 'aurora-parka',
    name: 'Aurora Down Parka',
    price: 199,
    category: 'Insulated Jackets & Winter Layers',
    activityId: 'winter',
    motif: 'jacket',
    blurb: 'Deep-winter warmth, city to trailhead.',
    detail:
      'Baffled down insulation, a storm hood, and fleece-lined pockets for the coldest mornings. Keeps the cold where it belongs: outside.',
  },
  {
    id: 'timberline-fleece',
    name: 'Timberline Fleece',
    price: 79,
    category: 'Insulated Jackets & Winter Layers',
    activityId: 'winter',
    motif: 'tee',
    blurb: 'The layer you never take off.',
    detail:
      'Mid-weight grid fleece that breathes on the move and holds warmth at rest. Lives under a shell or on its own.',
  },
  {
    id: 'cornice-shell',
    name: 'Cornice Shell Jacket',
    price: 279,
    category: 'Ski & Snowboard Outerwear',
    activityId: 'winter',
    motif: 'jacket',
    blurb: 'Built for deep days on the hill.',
    detail:
      'Waterproof-breathable shell with pit zips, a powder skirt, and a helmet-compatible hood. Ready for storm laps.',
  },
  {
    id: 'powder-bibs',
    name: 'Powder Bibs',
    price: 229,
    category: 'Ski & Snowboard Outerwear',
    activityId: 'winter',
    motif: 'jacket',
    blurb: 'No snow down your back. Ever.',
    detail:
      'Full-coverage bibs with thigh vents, reinforced cuffs, and a chest pocket sized for snacks. Deep-snow insurance.',
  },
  {
    id: 'mistral-windbreaker',
    name: 'Mistral Windbreaker',
    price: 99,
    category: 'Rain Shells & Windbreakers',
    activityId: 'rain',
    motif: 'rain',
    blurb: 'Packs into its own pocket.',
    detail:
      'A whisper-light shell that shrugs off drizzle and wind, then stuffs into its own chest pocket until the clouds roll in.',
  },
  {
    id: 'drizzle-shell',
    name: 'Drizzle Packable Shell',
    price: 129,
    category: 'Rain Shells & Windbreakers',
    activityId: 'rain',
    motif: 'rain',
    blurb: 'Everyday rain armor.',
    detail:
      'A 2.5-layer waterproof shell with an adjustable hood and zippered hand pockets. The jacket that lives in your bag.',
  },
  {
    id: 'monsoon-hardshell',
    name: 'Monsoon 3L Hardshell',
    price: 299,
    category: 'Waterproof Hardshells & Rain Gear',
    activityId: 'rain',
    motif: 'rain',
    blurb: 'For when the sky really opens up.',
    detail:
      'Three-layer, fully seam-sealed protection with a brimmed storm hood. Serious weather calls for serious fabric.',
  },
  {
    id: 'stormproof-pants',
    name: 'Stormproof Rain Pants',
    price: 149,
    category: 'Waterproof Hardshells & Rain Gear',
    activityId: 'rain',
    motif: 'rain',
    blurb: 'Dry legs, happy hiker.',
    detail:
      'Full side zips mean you can pull them on without taking off your boots. Seam-sealed, packable, dependable.',
  },
];

export function productById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function related(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(
    (p) => p.activityId === product.activityId && p.id !== product.id,
  ).slice(0, limit);
}

export const money = (n: number): string => `$${n}`;
