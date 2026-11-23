"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/** Помечает элемент data-in, когда он попал в экран. */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.in = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Блок, который выезжает, выглядывает или раскрывается шторкой. */
export function Reveal({
  as = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: "up" | "wipe" | "wipe-up";
  delay?: number;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `rv rv-${variant} ${className}`.trim(),
      style: { "--delay": `${delay}ms` } as CSSProperties,
      ...rest,
    },
    children,
  );
}

/** Заголовок: каждая строка «поднимается» из-под маски. */
export function Rise({
  lines,
  as = "h2",
  className = "",
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
}) {
  const ref = useInView<HTMLElement>(0.4);
  return createElement(
    as,
    { ref, className: `rise ${className}`.trim() },
    lines.map((line, i) =>
      createElement(
        "span",
        { className: "rise-line", key: i },
        createElement(
          "span",
          { style: { "--i": i } as CSSProperties },
          line,
        ),
      ),
    ),
  );
}
