"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from "lucide-react";
import { photos, venue } from "@/lib/restaurant";
import { Bracket } from "./brand";
import { Modal } from "./modal";
import { Reveal, Rise } from "./reveal";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const [hot, setHot] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef<number | null>(null);

  const step = (d: number) => {
    setDir(d);
    setActive((i) => ((i ?? 0) + d + photos.length) % photos.length);
  };

  return (
    <section className="gallery section-pad" id="gallery">
      <div className="shell">
        <div className="section-heading">
          <div className="heading-block">
            <Bracket />
            <Rise lines={["Атмосфера места"]} />
          </div>
          <a
            className="text-link"
            href={venue.tour}
            target="_blank"
            rel="noreferrer"
          >
            3D-тур от 360px <ArrowUpRight size={16} />
          </a>
        </div>
        <Reveal variant="wipe" className="strip" onMouseLeave={() => setHot(0)}>
          {photos.map((p, i) => (
            <button
              key={p.src}
              className="strip-item"
              data-hot={hot === i || undefined}
              onMouseEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              onClick={() => {
                setDir(1);
                setActive(i);
              }}
              aria-label={`Открыть фото: ${p.title}`}
            >
              <Image
                src={p.src}
                fill
                alt={p.alt}
                sizes="(max-width: 800px) 80vw, 45vw"
              />
              <span className="strip-shade" />
              <span className="strip-title">{p.title}</span>
              <span className="strip-vert" aria-hidden="true">{p.title}</span>
              <span className="strip-vert" aria-hidden="true">{p.title}</span>
              <span className="strip-open">
                <Maximize2 size={15} />
              </span>
            </button>
          ))}
        </Reveal>
      </div>

      {active !== null && (
        <Modal
          variant="wide"
          label="Фотогалерея Оранжереи"
          onClose={() => setActive(null)}
        >
          <div
            className="lightbox-body"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") step(1);
              if (e.key === "ArrowLeft") step(-1);
            }}
            onPointerDown={(e) => (touch.current = e.clientX)}
            onPointerUp={(e) => {
              if (touch.current === null) return;
              const dx = e.clientX - touch.current;
              touch.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            <div className="lightbox-img">
              <Image
                key={active}
                className="lightbox-photo"
                style={{ "--dir": dir } as CSSProperties}
                src={photos[active].src}
                alt={photos[active].alt}
                fill
                sizes="90vw"
              />
            </div>
            <div className="lightbox-foot">
              <span aria-live="polite">
                {active + 1} из {photos.length} — {photos[active].title}
              </span>
              <div className="slider-control">
                <button
                  className="round"
                  aria-label="Назад по галерее"
                  onClick={() => step(-1)}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  className="round"
                  aria-label="Вперёд по галерее"
                  onClick={() => step(1)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
