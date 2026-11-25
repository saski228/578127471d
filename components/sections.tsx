import { ArrowRight, ArrowUpRight, Coffee, CreditCard, Dog, MapPin, Music, ParkingCircle, ShoppingBag, Star, Sun, Wifi } from "lucide-react";
import { menuSections, type MenuSection } from "@/lib/restaurant";
import { dateRu, rub, telHref } from "@/lib/content";
import type { Category, Content } from "@/lib/types";
import { Bracket, Brand } from "./brand";
import { BookingButton } from "./booking";
import { Img as Image } from "./img";
import { Reveal, Rise } from "./reveal";
import { TLink } from "./transition";
import { LogoLockup } from "./logo";
import { OpenNow } from "./open-status";
import { HoursList } from "./hours-list";

const icons = { coffee: Coffee, sun: Sun, dog: Dog, parking: ParkingCircle, wifi: Wifi, bag: ShoppingBag, card: CreditCard, music: Music } as const;

const plural = (n: number) =>
  n % 10 === 1 && n % 100 !== 11 ? "позиция" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "позиции" : "позиций";
const shown = (c: Category) => (c.hidden ? [] : c.items.filter((i) => !i.hidden));

export function MenuPreview({ cats }: { cats: Category[] }) {
  return (
    <section className="menu-preview section-pad" id="menu">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block"><Bracket /><Rise lines={["Меню ресторана"]} /></div>
          <TLink className="text-link" href="/menu">Всё меню <ArrowUpRight size={17} /></TLink>
        </div>
        <div className="menu-cards">
          {menuSections.map((s, i) => {
            const items = cats.filter((c) => c.section === s.id).flatMap(shown);
            const picks = items.filter((x) => x.top).slice(0, 3);
            return (
              <Reveal key={s.id} delay={i * 110} variant="wipe-up" className="menu-card-wrap">
                <TLink href={`/menu?section=${s.id as MenuSection}`} className={`menu-card card-${s.id}`}>
                  <Image src={s.image} alt={s.alt} fill sizes="(max-width: 800px) 92vw, 33vw" />
                  <span className="card-shade" />
                  <span className="card-count">{items.length} {plural(items.length)}</span>
                  <span className="card-bottom">
                    <span className="card-title">{s.title}</span>
                    <ul className="card-peek">
                      {picks.map((p) => (<li key={p.id}><span>{p.title}</span><b>{rub(p.price)}</b></li>))}
                    </ul>
                    <span className="card-go">Открыть раздел<span className="card-arrow"><ArrowUpRight size={19} /></span></span>
                  </span>
                </TLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function About({ c }: { c: Content }) {
  const lines = c.t.aboutTitle.split("\n");
  return (
    <section id="about" className="about section-pad">
      <div className="shell about-grid">
        <Reveal variant="wipe" className="about-photo">
          <Image src="/photos/terrace.webp" alt="Летняя терраса ресторана на крыше" fill sizes="(max-width: 960px) 100vw, 55vw" />
        </Reveal>
        <div className="about-copy">
          <Rise lines={lines} />
          <Reveal as="p" delay={120}>{c.t.aboutP1}</Reveal>
          <Reveal as="p" delay={200}>{c.t.aboutP2} Средний чек — {c.s.avgCheck}.</Reveal>
          <Reveal as="ul" delay={260} className="facts">
            {c.facts.filter((f) => f.on).map((f) => {
              const Icon = icons[f.icon as keyof typeof icons] ?? Coffee;
              return (<li key={f.id}><Icon size={20} strokeWidth={1.6} /><span><b>{f.title}</b>{f.text}</span></li>);
            })}
          </Reveal>
          <Reveal delay={320}><BookingButton variant="dark" /></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Reviews({ c }: { c: Content }) {
  const { s } = c;
  return (
    <section id="reviews" className="reviews section-pad">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block"><Bracket /><Rise lines={["Гости о нас"]} /></div>
          <a className="text-link" href={s.reviewsUrl} target="_blank" rel="noreferrer">Читать отзывы на Яндекс Картах <ArrowUpRight size={16} /></a>
        </div>
        <Reveal className="rating-board">
          <div className="rating-main">
            <b className="rating-num">{s.ratingValue}</b>
            <span className="stars" aria-label={`Рейтинг ${s.ratingValue} из 5`}>
              {[0, 1, 2, 3, 4].map((i) => (<Star key={i} size={22} fill="currentColor" />))}
            </span>
            <p>{Number(s.ratingCount).toLocaleString("ru-RU")} оценок и {s.reviewsCount} отзывов на Яндекс Картах</p>
            <a className="pill ghost" href={s.reviewsUrl} target="_blank" rel="noreferrer">Оставить отзыв <ArrowUpRight size={16} /></a>
          </div>
          <div className="aspects">
            <h3>Что чаще всего хвалят</h3>
            {c.aspects.map((a) => (
              <div className="aspect" key={a.title} style={{ "--w": `${a.percent}%` } as React.CSSProperties}>
                <span>{a.title}</span>
                <i><u /></i>
                <b>{a.percent}%</b>
              </div>
            ))}
            <small>Доля положительных оценок по данным Яндекс Карт на {s.ratingDate}</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contacts({ c }: { c: Content }) {
  const { s } = c;
  return (
    <section id="contacts" className="contacts section-pad">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block"><Bracket /><Rise lines={["Ждём вас в гости"]} /></div>
          <MapPin className="contact-pin" size={34} strokeWidth={1.3} />
        </div>
        <Reveal className="contact-grid">
          <div>
            <h3>Как нас найти</h3>
            <p>Симферополь,<br />{s.address}</p>
            <span>{s.place}</span>
            <span>Парковка есть. Рядом остановка «ТРК Центрум».</span>
            <a href={s.routeUrl} target="_blank" rel="noreferrer" className="text-link">Построить маршрут <ArrowUpRight size={16} /></a>
          </div>
          <div>
            <h3>Время работы</h3>
            <OpenNow className="open-big" />
            <HoursList />
            <span className="hint">Завтраки с 9 до 12.</span>
          </div>
          <div>
            <h3>На связи</h3>
            <a className="contact-phone" href={telHref(s.phone)}>{s.phone}</a>
            <div className="contact-links">
              {s.vkUrl && <a className="text-link" href={s.vkUrl} target="_blank" rel="noreferrer">ВКонтакте <ArrowUpRight size={16} /></a>}
              {s.deliveryUrl && <a className="text-link" href={s.deliveryUrl} target="_blank" rel="noreferrer">Доставка (Крым.Еда) <ArrowUpRight size={16} /></a>}
              <a className="text-link" href={s.mapsUrl} target="_blank" rel="noreferrer">Яндекс Карты <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </Reveal>
        <Reveal className="map" variant="wipe">
          <iframe
            title="Оранжерея на карте"
            src={`https://yandex.ru/map-widget/v1/?oid=${s.mapsOid}&z=16`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ c }: { c: Content }) {
  const { s } = c;
  return (
    <footer>
      <div className="shell footer-inner">
        <Brand className="footer-brand" />
        <div className="footer-info">
          <span>Ресторан на крыше · Симферополь</span>
          <span>{s.address}, {s.place}</span>
          <span>{s.legalName}, ИНН {s.inn}, ОГРН {s.ogrn}</span>
        </div>
        <a className="to-top" href="#top">Наверх<span className="round"><ArrowRight size={16} /></span></a>
      </div>
      <div className="shell footer-big" aria-hidden="true"><LogoLockup /></div>
    </footer>
  );
}

export { dateRu };
