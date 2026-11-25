"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Img as Image } from "./img";
import {
  ArrowUpRight,
  Check,
  Copy,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  Receipt,
  Search,
  X,
} from "lucide-react";
import { menuSections, type MenuSection } from "@/lib/restaurant";
import { dateRu } from "@/lib/content";
import type { Category, Item } from "@/lib/types";
import { Bracket } from "./brand";
import { Modal } from "./modal";
import { useBooking } from "./booking";

type Pick = { key: string; title: string; size: string; price: number; qty: number };

const rub = (n: number | string) => `${Number(n).toLocaleString("ru-RU")} ₽`;
const norm = (s: string) => s.toLocaleLowerCase("ru").replaceAll("ё", "е").trim();
const fix = (t: string) => t;
const slug = (t: string) => `cat-${t.replace(/[^\p{L}\p{N}]+/gu, "-")}`;
const plural = (n: number, a: string, b: string, c: string) =>
  n % 10 === 1 && n % 100 !== 11
    ? a
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)
      ? b
      : c;

export function MenuCatalog({
  cats: allCats, note, updated, deliveryUrl,
}: { cats: Category[]; note: string; updated: string; deliveryUrl: string }) {
  const [group, setGroup] = useState<MenuSection>("kitchen");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("section");
    if (q === "bar" || q === "dessert") setGroup(q);
  }, []);
  const data = useMemo(
    () => allCats.filter((c) => !c.hidden).map((c) => ({ ...c, group: c.section, items: c.items.filter((i) => !i.hidden) })).filter((c) => c.items.length),
    [allCats],
  );
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [drawer, setDrawer] = useState(false);
  const [photo, setPhoto] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const book = useBooking();

  // Категории выбранного раздела, сгруппированные в «семьи».
  const families_ = useMemo(() => {
    const fams: { title: string; cats: typeof data }[] = [];
    for (const c of data.filter((x) => x.group === group)) {
      let f = fams.find((x) => x.title === c.family);
      if (!f) fams.push((f = { title: c.family, cats: [] }));
      f.cats.push(c);
    }
    return fams;
  }, [data, group]);

  const q = norm(query);
  const result = useMemo(
    () =>
      families_
        .map((f) => ({
          title: f.title,
          cats: f.cats
            .map((c) => ({
              ...c,
              items: c.items.filter(
                (i) => !q || norm(`${i.title} ${fix(c.title)}`).includes(q),
              ),
            }))
            .filter((c) => c.items.length > 0),
        }))
        .filter((f) => f.cats.length > 0),
    [families_, q],
  );
  const flat = result.flatMap((f) => f.cats);
  const found = flat.reduce((n, c) => n + c.items.length, 0);
  const total = data
    .filter((c) => c.group === group)
    .reduce((n, c) => n + c.items.length, 0);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        menuSections.map((s) => [
          s.id,
          data
            .filter((c) => c.group === s.id)
            .reduce((n, c) => n + c.items.length, 0),
        ]),
      ) as Record<MenuSection, number>,
    [data],
  );

  const changeGroup = useCallback((id: MenuSection) => {
    setGroup(id);
    setQuery("");
    setActiveCat("");
    window.history.replaceState(null, "", `/menu?section=${id}`);
    const top = document.getElementById("menu-start");
    if (top && window.scrollY > top.offsetTop)
      window.scrollTo({ top: top.offsetTop - 70, behavior: "smooth" });
  }, []);

  // Scroll-spy: какая категория сейчас на экране.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-cat]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActiveCat(e.target.getAttribute("data-cat")!);
      },
      { rootMargin: "-130px 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [result]);

  // Активная «таблетка» на мобильной ленте всегда в поле зрения.
  useEffect(() => {
    const rail = railRef.current;
    const el = rail?.querySelector<HTMLElement>("[aria-current='true']");
    if (!rail || !el) return;
    rail.scrollTo({
      left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeCat]);

  const jump = (title: string) => {
    setActiveCat(title);
    document
      .getElementById(slug(title))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // «Мой выбор».
  const change = (cat: string, i: Item, d: number) =>
    setPicks((p) => {
      const key = `${group}|${cat}|${i.title}`;
      const qty = (p[key]?.qty ?? 0) + d;
      const next = { ...p };
      if (qty <= 0) delete next[key];
      else
        next[key] = {
          key,
          title: i.title,
          size: i.size,
          price: Number(i.price),
          qty,
        };
      return next;
    });
  const list = Object.values(picks);
  const picked = list.reduce((n, p) => n + p.qty, 0);
  const sum = list.reduce((n, p) => n + p.qty * p.price, 0);

  const copyList = async () => {
    const text = [
      "Оранжерея — мой выбор",
      ...list.map((p) => `${p.qty} × ${p.title} — ${rub(p.qty * p.price)}`),
      `Итого: ${rub(sum)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* буфер недоступен — список остаётся на экране */
    }
  };

  const section = menuSections.find((s) => s.id === group)!;

  return (
    <main className="catalog">
      <section className="menu-hero">
        {menuSections.map((s) => (
          <div
            key={s.id}
            className="menu-hero-bg"
            data-on={s.id === group || undefined}
          >
            <Image src={s.image} alt="" fill sizes="100vw" priority={s.id === group} />
          </div>
        ))}
        <div className="menu-hero-shade" />
        <div className="shell menu-hero-body">
          <div className="heading-block hero-in">
            <Bracket />
            <h1 className="menu-title">Меню</h1>
          </div>
          <p className="menu-sub" key={group}>
            {section.title}: {counts[group]}{" "}
            {plural(counts[group], "позиция", "позиции", "позиций")}. Цены и вес
            порций — по меню ресторана.
          </p>
          <div
            className="segment"
            role="tablist"
            aria-label="Разделы меню"
            style={{ "--idx": menuSections.findIndex((s) => s.id === group) } as CSSProperties}
          >
            <span className="segment-thumb" aria-hidden="true" />
            {menuSections.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={s.id === group}
                onClick={() => changeGroup(s.id)}
              >
                {s.short}
                <sup>{counts[s.id]}</sup>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div id="menu-start" />
      <div className="toolbar">
        <div className="shell toolbar-inner">
          <label className="searchbox">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Поиск в выбранном разделе"
              placeholder={
                group === "bar"
                  ? "Найти коктейль, вино, чай…"
                  : group === "dessert"
                    ? "Найти десерт…"
                    : "Найти блюдо…"
              }
            />
            {query && (
              <button aria-label="Очистить поиск" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </label>
          <span className="found" aria-live="polite">
            {q
              ? `Найдено: ${found}`
              : `${total} ${plural(total, "позиция", "позиции", "позиций")}`}
          </span>
          <a
            className="text-link toolbar-delivery"
            target="_blank"
            rel="noreferrer"
            href={deliveryUrl}
          >
            Заказать доставку <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="rail" ref={railRef}>
          {flat.map((c) => (
            <button
              key={c.title}
              aria-current={activeCat === c.title ? "true" : undefined}
              onClick={() => jump(c.title)}
            >
              {fix(c.title)}
            </button>
          ))}
        </div>
      </div>

      <div className="shell catalog-grid">
        <aside className="side" aria-label="Категории">
          {result.map((f) => (
            <div key={f.title} className="side-family">
              {result.length > 1 && <h2>{f.title}</h2>}
              {f.cats.map((c) => (
                <button
                  key={c.title}
                  aria-current={activeCat === c.title ? "true" : undefined}
                  onClick={() => jump(c.title)}
                >
                  <span>{fix(c.title)}</span>
                  <small>{c.items.length}</small>
                </button>
              ))}
            </div>
          ))}
        </aside>

        <div className="catalog-list" key={group}>
          {flat.length === 0 ? (
            <div className="empty-search">
              <Leaf size={30} strokeWidth={1.3} />
              <h2>Ничего не нашлось</h2>
              <p>
                Попробуйте другое название или сбросьте поиск, чтобы увидеть
                весь раздел.
              </p>
              <button className="pill ghost" onClick={() => setQuery("")}>
                Сбросить поиск
              </button>
            </div>
          ) : (
            flat.map((c) => (
              <section
                key={c.title}
                id={slug(c.title)}
                data-cat={c.title}
                className="catalog-group"
              >
                <header>
                  <h2>{fix(c.title)}</h2>
                  <span>
                    {c.items.length}{" "}
                    {plural(c.items.length, "позиция", "позиции", "позиций")}
                  </span>
                </header>
                <div className="dish-list">
                  {c.items.map((i, n) => {
                    const key = `${group}|${c.title}|${i.title}`;
                    const qty = picks[key]?.qty ?? 0;
                    return (
                      <article
                        className="dish"
                        data-picked={qty > 0 || undefined}
                        key={i.id}
                        style={{ "--n": Math.min(n, 12) } as CSSProperties}
                      >
                        {i.photo ? (
                          <button
                            className="dish-photo"
                            onClick={() => setPhoto(i)}
                            aria-label={`Фото: ${i.title}`}
                          >
                            <Image src={i.photo} alt="" width={96} height={96} sizes="96px" />
                            <span>
                              <Maximize2 size={14} />
                            </span>
                          </button>
                        ) : null}
                        <div className="dish-info">
                          <h3>{i.title}</h3>
                          {i.size && <span>{i.size}</span>}
                        </div>
                        <b className="dish-price">{rub(i.price)}</b>
                        <div className="stepper" data-on={qty > 0 || undefined}>
                          {qty > 0 ? (
                            <>
                              <button
                                aria-label="Убрать одну порцию"
                                onClick={() => change(c.title, i, -1)}
                              >
                                <Minus size={15} />
                              </button>
                              <output aria-live="polite">{qty}</output>
                              <button
                                aria-label="Добавить ещё порцию"
                                onClick={() => change(c.title, i, 1)}
                              >
                                <Plus size={15} />
                              </button>
                            </>
                          ) : (
                            <button
                              className="add"
                              aria-label={`Добавить в мой выбор: ${i.title}`}
                              onClick={() => change(c.title, i, 1)}
                            >
                              <Plus size={17} />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
          <p className="catalog-source">
            <span>{note} Меню обновлено {dateRu(updated)}.</span>
            <a className="text-link" href={deliveryUrl} target="_blank" rel="noreferrer">
              Заказать доставку <ArrowUpRight size={14} />
            </a>
          </p>
        </div>
      </div>

      <div className="basket" data-show={picked > 0 || undefined}>
        <button onClick={() => setDrawer(true)} tabIndex={picked > 0 ? 0 : -1}>
          <Receipt size={19} />
          <span>
            Мой выбор: {picked} {plural(picked, "позиция", "позиции", "позиций")}
          </span>
          <b>{rub(sum)}</b>
        </button>
      </div>

      {drawer && (
        <Modal
          variant="drawer"
          label="Мой выбор"
          onClose={() => setDrawer(false)}
        >
          <div className="drawer">
            <h2>Мой выбор</h2>
            {list.length === 0 ? (
              <p className="drawer-empty">
                Пока пусто. Нажимайте «+» у блюд, чтобы прикинуть счёт на
                компанию.
              </p>
            ) : (
              <ul>
                {list.map((p) => (
                  <li key={p.key}>
                    <div>
                      <h3>{p.title}</h3>
                      <span>
                        {p.size} · {rub(p.price)}
                      </span>
                    </div>
                    <div className="stepper" data-on>
                      <button
                        aria-label="Убрать одну порцию"
                        onClick={() =>
                          setPicks((s) => {
                            const n = { ...s };
                            if (n[p.key].qty <= 1) delete n[p.key];
                            else n[p.key] = { ...n[p.key], qty: n[p.key].qty - 1 };
                            return n;
                          })
                        }
                      >
                        <Minus size={15} />
                      </button>
                      <output>{p.qty}</output>
                      <button
                        aria-label="Добавить ещё порцию"
                        onClick={() =>
                          setPicks((s) => ({
                            ...s,
                            [p.key]: { ...s[p.key], qty: s[p.key].qty + 1 },
                          }))
                        }
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <b>{rub(p.qty * p.price)}</b>
                  </li>
                ))}
              </ul>
            )}
            <div className="drawer-foot">
            <div className="drawer-total">
              <span>Итого</span>
              <b>{rub(sum)}</b>
            </div>
            <div className="drawer-actions">
              <button className="pill primary" onClick={copyList} disabled={!list.length}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Скопировано" : "Скопировать список"}
              </button>
              <button
                className="pill ghost"
                onClick={() => {
                  setDrawer(false);
                  window.setTimeout(book, 320);
                }}
              >
                Забронировать стол
              </button>
              {list.length > 0 && (
                <button className="text-link" onClick={() => setPicks({})}>
                  Очистить
                </button>
              )}
            </div>
            <p className="small-note">
              Это не заказ: список не уходит в ресторан. Покажите его официанту
              или скопируйте, чтобы обсудить с компанией.
            </p>
            </div>
          </div>
        </Modal>
      )}

      {photo && (
        <Modal variant="wide" label={photo.title} onClose={() => setPhoto(null)}>
          <div className="lightbox-img">
            <Image
              className="lightbox-photo"
              src={photo.photo!}
              alt={photo.title}
              fill
              sizes="90vw"
            />
          </div>
          <div className="lightbox-foot">
            <span>{photo.title}</span>
            <b>
              {photo.size} · {rub(photo.price)}
            </b>
          </div>
        </Modal>
      )}
    </main>
  );
}
