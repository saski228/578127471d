import type { Metadata } from "next";
import { Footer } from "@/components/sections";
import { MenuCatalog } from "@/components/menu-catalog";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Меню ресторана",
  description: "Основное меню, барная карта и десерты ресторана Оранжерея в Симферополе: названия, вес порций и цены.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const c = await getContent();
  return (
    <div id="top" className="menu-page">
      <MenuCatalog cats={c.cats} note={c.t.menuNote} updated={c.menuUpdated} deliveryUrl={c.s.deliveryUrl} />
      <Footer c={c} />
    </div>
  );
}
