"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowRight, MapPin, Star } from "lucide-react";
import { photos, venue } from "@/lib/restaurant";
import { BookingButton } from "./booking";
import { LogoLockup } from "./logo";
import { OpenNow } from "./open-status";

const SLIDES = photos.slice(0, 3);

export function Hero() {
  const [state, setState] = useState({ cur: 0, prev: -1, moved: false });
  const [paused, setPaused] = useState(false);
  const go = (to: number) =>
    setState((s) => ({
      cur: (to + SLIDES.length) % SLIDES.length,
      prev: s.cur,
      moved: true,
    }));

  return (
    <section
      className="hero"
      aria-label="Ресторан Оранжерея"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-slides">
        {SLIDES.map((p, i) => (
          <div
            key={p.src}
            className="hero-slide"
            data-state={
              i === state.cur ? "active" : i === state.prev ? "prev" : "off"
            }
            data-moved={state.moved || undefined}
            aria-hidden={i !== state.cur}
          >
            <Image
              src={p.src}
              fill
              alt={p.alt}
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-bloom" aria-hidden="true" />

      <div className="shell hero-body">
        <div className="hero-copy">
          <h1 className="hero-logo">
            <span className="sr-only">
              Оранжерея — ресторан на крыше в Симферополе
            </span>
            <LogoLockup animated />
          </h1>
          <p className="hero-lead hero-in" style={{ "--n": 0 } as CSSProperties}>
            Ресторан на крыше. Авторская кухня, живая зелень и панорамный вид
            на город с высоты четвёртого этажа.
          </p>
          <div className="hero-actions hero-in" style={{ "--n": 1 } as CSSProperties}>
            <BookingButton />
            <a className="pill ghost" href="#menu">
              Смотреть меню <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="shell hero-foot hero-in" style={{ "--n": 2 } as CSSProperties}>
        <div className="hero-meta">
          <a href={venue.maps} target="_blank" rel="noreferrer">
            <MapPin size={15} />
            {venue.address}
          </a>
          <span className="meta-sep" />
          <a
            className="rating"
            href={`${venue.maps}reviews/`}
            target="_blank"
            rel="noreferrer"
          >
            <Star size={14} fill="currentColor" />
            <b>4,9</b> Яндекс Карты
          </a>
          <span className="meta-sep" />
          <OpenNow />
        </div>
        <div className="slider-control">
          <span
            className="counter"
            aria-live="polite"
            aria-label={`Фото ${state.cur + 1} из ${SLIDES.length}: ${SLIDES[state.cur].title}`}
          >
            0{state.cur + 1}
            <i>
              <b
                key={state.cur}
                data-paused={paused || undefined}
                onAnimationEnd={() => go(state.cur + 1)}
              />
            </i>
            <span>0{SLIDES.length}</span>
          </span>
          <button
            className="round"
            aria-label="Предыдущее фото"
            onClick={() => go(state.cur - 1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            className="round"
            aria-label="Следующее фото"
            onClick={() => go(state.cur + 1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
