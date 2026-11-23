"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { Modal } from "./modal";
import { Crown } from "./logo";
import { venue } from "@/lib/restaurant";

const BookingContext = createContext<() => void>(() => {});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <BookingContext.Provider value={() => setOpen(true)}>
      {children}
      {open && (
        <Modal label="Забронировать стол" onClose={() => setOpen(false)}>
          <div className="booking-photo">
            <Crown className="booking-crown" />
          </div>
          <div className="booking-body">
            <h2>Забронировать стол</h2>
            <p>
              Позвоните нам, чтобы выбрать столик в зале или на террасе.
              Администратор уточнит дату, время и количество гостей.
            </p>
            <a className="pill primary booking-phone" href={venue.tel}>
              <Phone size={17} />
              {venue.phone}
            </a>
            <a
              className="text-link"
              href={venue.vk}
              target="_blank"
              rel="noreferrer"
            >
              Написать во ВКонтакте <ArrowUpRight size={16} />
            </a>
            <p className="small-note">
              Бронь действует после подтверждения администратором.
            </p>
          </div>
        </Modal>
      )}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingButton({
  variant = "primary",
  className = "",
}: {
  variant?: "primary" | "ghost" | "dark";
  className?: string;
}) {
  const show = useBooking();
  return (
    <button
      onClick={show}
      className={`pill ${variant} ${className}`.trim()}
    >
      <span className="long">Забронировать стол</span>
      <span className="short">Забронировать</span>
      <ArrowUpRight size={16} />
    </button>
  );
}
