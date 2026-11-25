"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Day, Settings, Texts } from "@/lib/types";

type Site = { s: Settings; t: Texts; hours: Day[] };
const Ctx = createContext<Site | null>(null);

export function SiteProvider({ value, children }: { value: Site; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useSite() {
  const v = useContext(Ctx);
  if (!v) throw new Error("SiteProvider отсутствует");
  return v;
}
