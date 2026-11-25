export type Section = "kitchen" | "bar" | "dessert";
export type Item = {
  id: string;
  title: string;
  size: string;
  price: number;
  photo?: string;
  hidden?: boolean;
  top?: boolean; // показывать на главной в карточке раздела
  check?: string; // заметка для администратора: источники расходятся
};
export type Category = {
  id: string;
  section: Section;
  title: string;
  family: string;
  hidden?: boolean;
  items: Item[];
};
export type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  source: string;
  date: string;
  visible: boolean;
};
export type Promo = {
  id: string;
  title: string;
  text: string;
  image?: string;
  until?: string;
  visible: boolean;
};
export type Photo = { id: string; src: string; title: string; alt: string };
export type Day = { open: string; close: string; closed?: boolean };
export type Fact = { id: string; icon: string; title: string; text: string; on: boolean };
export type Aspect = { title: string; percent: number };

export type Settings = {
  phone: string;
  address: string;
  place: string;
  mapsUrl: string;
  mapsOid: string;
  routeUrl: string;
  panoramaUrl: string;
  vkUrl: string;
  tgUrl: string;
  deliveryUrl: string;
  reviewsUrl: string;
  ratingValue: string;
  ratingCount: string;
  reviewsCount: string;
  ratingDate: string;
  avgCheck: string;
  metrika: string;
  legalName: string;
  inn: string;
  ogrn: string;
  legalAddress: string;
  seoTitle: string;
  seoDescription: string;
};
export type Texts = {
  heroLead: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  menuNote: string;
  bookingNote: string;
};
export type Content = {
  v: 1;
  updated: string;
  menuUpdated: string;
  s: Settings;
  t: Texts;
  hours: Day[]; // 0 = воскресенье
  facts: Fact[];
  aspects: Aspect[];
  gallery: Photo[];
  reviews: Review[];
  promos: Promo[];
  cats: Category[];
};
export type Booking = {
  id: string;
  at: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  kind: string;
  comment: string;
  done?: boolean;
};
