import { LogoLockup } from "./logo";
import { TLink } from "./transition";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <TLink
      href="/"
      className={`brand ${className}`.trim()}
      aria-label="Оранжерея — на главную"
    >
      <LogoLockup />
    </TLink>
  );
}

/** Маркер раздела: скоба из логотипа, она же — единственный «орнамент» сайта. */
export function Bracket({ className = "" }: { className?: string }) {
  return <span className={`bracket ${className}`.trim()} aria-hidden="true" />;
}
