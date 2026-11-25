import { seed } from "./seed";
import type { Content } from "./types";

/** Всё содержимое сайта лежит в lib/seed.ts и lib/seed-menu.json. */
export async function getContent(): Promise<Content> {
  return seed;
}

export const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;
export const telHref = (p: string) => `tel:+${p.replace(/\D/g, "").replace(/^8/, "7")}`;
export const dateRu = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
};
