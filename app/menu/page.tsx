import type { Metadata } from "next";
import { Footer } from "@/components/sections";
import { MenuCatalog } from "@/components/menu-catalog";

export const metadata: Metadata = {
  title: "Меню ресторана",
  description:
    "Основное меню, барная карта и десерты ресторана Оранжерея в Симферополе. Названия блюд, вес порций и цены.",
};
export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const initial =
    section === "bar" || section === "dessert" ? section : "kitchen";
  return (
    <div id="top" className="menu-page">
      <MenuCatalog initial={initial} key={initial} />
      <Footer />
    </div>
  );
}
