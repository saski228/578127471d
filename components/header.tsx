"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Brand } from "./brand";
import { BookingButton } from "./booking";
import { TLink } from "./transition";
import { venue } from "@/lib/restaurant";

const nav = [
  { label: "Меню", href: "/menu", id: "menu" },
  { label: "О ресторане", href: "/#about", id: "about" },
  { label: "Галерея", href: "/#gallery", id: "gallery" },
  { label: "Контакты", href: "/#contacts", id: "contacts" },
];

export function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState("");
  const bar = useRef<HTMLDivElement>(null);

  // Прогресс прокрутки и «стеклянная» шапка.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.current?.style.setProperty(
          "--p",
          String(max > 0 ? Math.min(1, y / max) : 0),
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Какой раздел главной сейчас в центре экрана.
  useEffect(() => {
    if (!home) return;
    const els = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSpy(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => {
      if (window.scrollY < 240) setSpy("");
    };
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
      setSpy("");
    };
  }, [home]);

  // Мобильное меню: закрываем при переходе, блокируем прокрутку.
  useEffect(() => setMobile(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const current = home ? spy : "menu";
  const solid = !home || scrolled || mobile;

  return (
    <header
      className="site-header"
      data-solid={solid || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape") setMobile(false);
      }}
    >
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Главная навигация" className="desktop-nav">
          {nav.map((n) => (
            <TLink
              href={n.href}
              key={n.id}
              aria-current={current === n.id ? "true" : undefined}
            >
              {n.label}
            </TLink>
          ))}
        </nav>
        <div className="header-end">
          <a className="header-phone" href={venue.tel}>
            <Phone size={15} />
            {venue.phone}
          </a>
          <BookingButton variant="ghost" className="booking-top" />
          <button
            className="burger"
            onClick={() => setMobile(!mobile)}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            aria-label={mobile ? "Закрыть навигацию" : "Открыть навигацию"}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
      <div className="progress" ref={bar} aria-hidden="true">
        <i />
      </div>
      <div
        id="mobile-nav"
        className="mnav"
        data-open={mobile || undefined}
        inert={!mobile}
      >
        <nav aria-label="Мобильная навигация" className="shell">
          {nav.map((n, i) => (
            <TLink
              key={n.id}
              href={n.href}
              style={{ "--i": i } as CSSProperties}
              onClick={() => setMobile(false)}
            >
              <span>{n.label}</span>
              <ArrowUpRight size={22} />
            </TLink>
          ))}
        </nav>
        <div className="shell mnav-foot" style={{ "--i": 5 } as CSSProperties}>
          <a href={venue.tel}>
            <Phone size={16} /> {venue.phone}
          </a>
          <a href={venue.maps} target="_blank" rel="noreferrer">
            <MapPin size={16} /> {venue.address}
          </a>
        </div>
      </div>
    </header>
  );
}
