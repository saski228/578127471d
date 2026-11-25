"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Modal } from "./modal";
import { Crown } from "./logo";
import { useSite } from "./site-context";
import { telHref } from "@/lib/content";

const BookingContext = createContext<() => void>(() => {});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { s, t } = useSite();
  return (
    <BookingContext.Provider value={() => setOpen(true)}>
      {children}
      {open && (
        <Modal label="Забронировать стол" onClose={() => setOpen(false)}>
          <div className="booking-photo"><Crown className="booking-crown" /></div>
          <div className="booking-body">
            <h2>Забронировать стол</h2>
            <p>Позвоните нам, чтобы выбрать столик в зале или на террасе. Администратор уточнит дату, время и количество гостей.</p>
            <a className="pill primary booking-phone" href={telHref(s.phone)}><Phone size={17} />{s.phone}</a>
            {s.vkUrl && <a className="text-link" href={s.vkUrl} target="_blank" rel="noreferrer">Написать во ВКонтакте <ArrowUpRight size={16} /></a>}
            <a className="text-link" href={s.routeUrl} target="_blank" rel="noreferrer">Построить маршрут <MapPin size={16} /></a>
            <p className="small-note">{t.bookingNote}</p>
          </div>
        </Modal>
      )}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);

export function BookingButton({ variant = "primary", className = "" }: { variant?: "primary" | "ghost" | "dark"; className?: string }) {
  const show = useBooking();
  return (
    <button onClick={show} className={`pill ${variant} ${className}`.trim()}>
      <span className="long">Забронировать стол</span>
      <span className="short">Забронировать</span>
      <ArrowUpRight size={16} />
    </button>
  );
}
