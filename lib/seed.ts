import menu from "./seed-menu.json";
import type { Content, Category } from "./types";

/**
 * Стартовое содержимое сайта. Каждый факт здесь взят с карточки ресторана
 * на Яндекс Картах (подтверждена владельцем) или с меню доставки Крым.Еда.
 * Всё меняется в админке: /admin.
 */
export const seed: Content = {
  v: 1,
  updated: "2026-11-24",
  menuUpdated: "2026-11-24",
  s: {
    phone: "+7 (978) 901-11-20",
    address: "ул. Севастопольская, 62",
    place: "ТРК «Центрум», 4 этаж",
    mapsUrl: "https://yandex.ru/maps/org/oranzhereya/63062612790/",
    mapsOid: "63062612790",
    routeUrl: "https://yandex.ru/maps/?rtext=~44.937691%2C34.093679&rtt=auto",
    panoramaUrl: "https://yandex.ru/maps/org/oranzhereya/63062612790/panorama/",
    vkUrl: "https://vk.ru/orangery.simf",
    tgUrl: "",
    deliveryUrl:
      "https://xn----8sbldxm1a2g.xn--p1ai/simferopol/restaurants/p_oranzhereia/",
    reviewsUrl: "https://yandex.ru/maps/org/oranzhereya/63062612790/reviews/",
    ratingValue: "4,9",
    ratingCount: "1305",
    reviewsCount: "658",
    ratingDate: "24.11.2026",
    avgCheck: "1500–2500 ₽",
    metrika: "",
    legalName: "ООО «Оранжерея Проджект»",
    inn: "9204571457",
    ogrn: "1189204008190",
    legalAddress: "г. Симферополь, ул. Севастопольская, д. 62",
    seoTitle: "Оранжерея — ресторан на крыше в Симферополе",
    seoDescription:
      "Ресторан на крыше ТРК «Центрум» в Симферополе: меню с ценами, барная карта, десерты, летняя терраса. Севастопольская, 62, 4 этаж. Бронь столов по телефону.",
  },
  t: {
    heroLead:
      "Ресторан на крыше ТРК «Центрум»: европейская и азиатская кухня, большая барная карта, живая зелень и летняя терраса.",
    aboutTitle: "Город внизу.\nВы — на крыше.",
    aboutP1:
      "На четвёртом этаже «Центрума» шум города остаётся внизу. В зале живая зелень и мягкий свет, а за окнами летняя терраса.",
    aboutP2:
      "Приходите на завтрак, обед или ужин: в меню паста, пицца, роллы, стейки и десерты, а ещё большая барная карта с коктейлями, вином и чаем.",
    menuNote:
      "Цены и вес порций указаны по данным ресторана. Наличие блюд и актуальные цены уточняйте у администратора.",
    bookingNote:
      "Бронь действует после подтверждения администратором.",
  },
  hours: [
    { open: "09:00", close: "23:00" }, // воскресенье
    { open: "12:00", close: "23:00" }, // понедельник
    { open: "09:00", close: "23:00" },
    { open: "09:00", close: "23:00" },
    { open: "09:00", close: "23:00" },
    { open: "09:00", close: "00:00" },
    { open: "09:00", close: "00:00" },
  ],
  facts: [
    { id: "f1", icon: "coffee", title: "Завтраки", text: "с 9 до 12", on: true },
    { id: "f2", icon: "sun", title: "Летняя терраса", text: "на крыше", on: true },
    { id: "f3", icon: "dog", title: "С собакой", text: "можно", on: true },
    { id: "f4", icon: "parking", title: "Парковка", text: "есть", on: true },
    { id: "f5", icon: "wifi", title: "Wi-Fi", text: "есть", on: true },
    { id: "f6", icon: "bag", title: "Доставка", text: "и навынос", on: true },
    { id: "f7", icon: "card", title: "Оплата картой", text: "принимаем", on: true },
    { id: "f8", icon: "music", title: "Живая музыка", text: "и DJ", on: false },
  ],
  aspects: [
    { title: "Подача блюд", percent: 97 },
    { title: "Летняя терраса", percent: 93 },
    { title: "Атмосфера", percent: 92 },
    { title: "Интерьер", percent: 92 },
    { title: "Кухня", percent: 85 },
    { title: "Персонал", percent: 80 },
  ],
  gallery: [
    { id: "g1", src: "/photos/hall.webp", title: "Основной зал", alt: "Зал Оранжереи с мягкими диванами и кольцами живой зелени под потолком" },
    { id: "g2", src: "/photos/terrace.webp", title: "Терраса над городом", alt: "Летняя терраса на крыше ТРК Центрум" },
    { id: "g3", src: "/photos/cocktails.webp", title: "За барной стойкой", alt: "Коктейли Оранжереи на подносе" },
    { id: "g4", src: "/photos/evening.webp", title: "Вечер в Оранжерее", alt: "Вечерний зал ресторана и клетки с птицами" },
    { id: "g5", src: "/photos/sunset.webp", title: "На закате", alt: "Вечернее небо над террасой" },
  ],
  reviews: [],
  promos: [],
  cats: menu as Category[],
};
