import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Coffee,
  Dog,
  MapPin,
  ParkingCircle,
  ShoppingBag,
  Sun,
  Wifi,
} from "lucide-react";
import data from "@/lib/menu-data.json";
import {
  facts,
  menuSections,
  peek,
  venue,
  type MenuSection,
} from "@/lib/restaurant";
import { hoursRows } from "@/lib/hours";
import { Bracket, Brand } from "./brand";
import { BookingButton } from "./booking";
import { Reveal, Rise } from "./reveal";
import { TLink } from "./transition";
import { LogoLockup } from "./logo";
import { OpenNow } from "./open-status";
import { HoursList } from "./hours-list";

const icons = {
  breakfast: Coffee,
  terrace: Sun,
  dog: Dog,
  parking: ParkingCircle,
  wifi: Wifi,
  delivery: ShoppingBag,
} as const;

const rub = (n: string | number) => `${Number(n).toLocaleString("ru-RU")} ₽`;
const plural = (n: number) =>
  n % 10 === 1 && n % 100 !== 11
    ? "позиция"
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)
      ? "позиции"
      : "позиций";

export function MenuPreview() {
  const all = data.flatMap((c) => c.items.map((i) => ({ ...i, group: c.group })));
  return (
    <section className="menu-preview section-pad" id="menu">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block">
            <Bracket />
            <Rise lines={["Меню ресторана"]} />
          </div>
          <TLink className="text-link" href="/menu">
            Всё меню <ArrowUpRight size={17} />
          </TLink>
        </div>
        <div className="menu-cards">
          {menuSections.map((s, i) => {
            const count = data
              .filter((c) => c.group === s.id)
              .reduce((n, c) => n + c.items.length, 0);
            const picks = peek[s.id as MenuSection]
              .map((t) => all.find((a) => a.title === t && a.group === s.id))
              .filter((x) => !!x);
            return (
              <Reveal
                key={s.id}
                delay={i * 110}
                variant="wipe-up"
                className="menu-card-wrap"
              >
                <TLink
                  href={`/menu?section=${s.id}`}
                  className={`menu-card card-${s.id}`}
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, 32vw"
                  />
                  <span className="card-shade" />
                  <span className="card-count">
                    {count} {plural(count)}
                  </span>
                  <span className="card-bottom">
                    <span className="card-title">{s.title}</span>
                    <ul className="card-peek">
                      {picks.map((p) => (
                        <li key={p!.title}>
                          <span>{p!.title}</span>
                          <b>{rub(p!.price)}</b>
                        </li>
                      ))}
                    </ul>
                    <span className="card-go">
                      Открыть раздел
                      <span className="card-arrow">
                        <ArrowUpRight size={19} />
                      </span>
                    </span>
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

export function About() {
  return (
    <section id="about" className="about section-pad">
      <div className="shell about-grid">
        <Reveal variant="wipe" className="about-photo">
          <Image
            src="/photos/terrace.webp"
            alt="Открытая терраса ресторана над Симферополем"
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        </Reveal>
        <div className="about-copy">
          <Rise lines={["Город внизу.", "Вы — на крыше."]} />
          <Reveal as="p" delay={120}>
            На четвёртом этаже «Центрума» шум Симферополя остаётся внизу. В зале
            мягкий свет и живая зелень, за окнами летняя терраса с видом на
            город.
          </Reveal>
          <Reveal as="p" delay={200}>
            Приходите на пасту с морепродуктами, выбирайте коктейль к закату или
            собирайте близких за большим столом. Средний чек — 1500–2500 ₽.
          </Reveal>
          <Reveal as="ul" delay={260} className="facts">
            {facts.map((f) => {
              const Icon = icons[f.id];
              return (
                <li key={f.id}>
                  <Icon size={20} strokeWidth={1.6} />
                  <span>
                    <b>{f.title}</b>
                    {f.text}
                  </span>
                </li>
              );
            })}
          </Reveal>
          <Reveal delay={320}>
            <BookingButton variant="dark" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Contacts() {
  return (
    <section id="contacts" className="contacts section-pad">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block">
            <Bracket />
            <Rise lines={["Ждём вас в гости"]} />
          </div>
          <MapPin className="contact-pin" size={34} strokeWidth={1.3} />
        </div>
        <Reveal className="contact-grid">
          <div>
            <h3>Как нас найти</h3>
            <p>
              Симферополь,
              <br />
              {venue.address}
            </p>
            <span>{venue.place}</span>
            <span>Есть парковка.</span>
            <a
              href={venue.maps}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Открыть Яндекс Карты <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h3>Время работы</h3>
            <OpenNow className="open-big" />
            <HoursList rows={hoursRows} />
          </div>
          <div>
            <h3>На связи</h3>
            <a className="contact-phone" href={venue.tel}>
              {venue.phone}
            </a>
            <div className="contact-links">
              <a
                className="text-link"
                href={venue.vk}
                target="_blank"
                rel="noreferrer"
              >
                ВКонтакте <ArrowUpRight size={16} />
              </a>
              <a
                className="text-link"
                href={venue.delivery}
                target="_blank"
                rel="noreferrer"
              >
                Доставка из ресторана <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="shell footer-inner">
        <Brand className="footer-brand" />
        <div className="footer-info">
          <span>Ресторан на крыше · Симферополь</span>
          <span>
            {venue.address}, {venue.place}
          </span>
        </div>
        <a className="to-top" href="#top">
          Наверх
          <span className="round">
            <ArrowRight size={16} />
          </span>
        </a>
      </div>
      <div className="shell footer-big" aria-hidden="true">
        <LogoLockup />
      </div>
    </footer>
  );
}
