"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Crown } from "./logo";

type Phase = "idle" | "cover" | "reveal";
const PANES = 7;
const COVER_MS = 560;

const GoContext = createContext<(href: string) => boolean>(() => false);

const setStage = (value: "boot" | "in") => {
  document.documentElement.dataset.stage = value;
};

/**
 * Переход между страницами: теплица «закрывается» стеклянными панелями,
 * страница меняется под ними, затем панели поднимаются.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const timers = useRef<number[]>([]);
  const firstRender = useRef(true);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const change = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = useCallback(() => {
    change("reveal");
    requestAnimationFrame(() => requestAnimationFrame(() => setStage("in")));
    later(() => change("idle"), 900);
  }, []);

  // Первый показ страницы: запускаем вступительную анимацию.
  useEffect(() => {
    const id = requestAnimationFrame(() => setStage("in"));
    const list = timers.current;
    return () => {
      cancelAnimationFrame(id);
      list.forEach(clearTimeout);
    };
  }, []);

  // Новая страница отрисована — поднимаем панели.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    if (phaseRef.current === "cover") finish();
  }, [pathname, finish]);

  const go = useCallback(
    (href: string) => {
      const path = href.split(/[?#]/)[0] || "/";
      if (path === pathRef.current) return false;
      if (phaseRef.current !== "idle") return true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return false;
      change("cover");
      later(() => {
        setStage("boot");
        router.push(href);
        // Страховка: если переход завис, не оставляем гостя за стеклом.
        later(() => {
          if (phaseRef.current === "cover") finish();
        }, 3000);
      }, COVER_MS);
      return true;
    },
    [router, finish],
  );

  return (
    <GoContext.Provider value={go}>
      {children}
      <div className="veil" data-phase={phase} aria-hidden="true">
        {Array.from({ length: PANES }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
        <Crown className="veil-mark" />
      </div>
    </GoContext.Provider>
  );
}

/** Ссылка, которая включает переход, если ведёт на другую страницу. */
export function TLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const go = useContext(GoContext);
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0 ||
          typeof href !== "string"
        )
          return;
        if (go(href)) e.preventDefault();
      }}
    />
  );
}
