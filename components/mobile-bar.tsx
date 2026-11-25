"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Phone, CalendarCheck } from "lucide-react";
import { useBooking } from "./booking";
import { useSite } from "./site-context";
import { telHref } from "@/lib/content";

/** Нижняя панель на телефоне: самое нужное под большим пальцем. */
export function MobileBar() {
  const { s } = useSite();
  const book = useBooking();
  const home = usePathname() === "/";
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 520);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!home) return null;
  return (
    <nav className="mbar" data-show={show || undefined} aria-label="Быстрые действия">
      <a href={telHref(s.phone)}><Phone size={18} />Позвонить</a>
      <button onClick={book}><CalendarCheck size={18} />Бронь</button>
      <a href={s.routeUrl} target="_blank" rel="noreferrer"><MapPin size={18} />Маршрут</a>
    </nav>
  );
}
