import { useId, type CSSProperties } from "react";
import { logo } from "./logo-data";

const vars = (o: Record<string, number | string>) => o as CSSProperties;

function CrownParts({ animated = false }: { animated?: boolean }) {
  const mid = Math.floor(logo.blades.length / 2);
  return (
    <>
      {logo.blades.map((b, i) => (
        <g key={`b${i}`} transform={b.t}>
          <path
            className={animated ? "lg-blade" : undefined}
            style={animated ? vars({ "--d": Math.abs(i - mid) }) : undefined}
            d={b.d}
          />
        </g>
      ))}
      {logo.leaves.map((l, i) => (
        <g key={`l${i}`} transform={l.t}>
          <path
            className={animated ? "lg-leaf" : undefined}
            style={animated ? vars({ "--d": i % 3 }) : undefined}
            d={l.d}
          />
        </g>
      ))}
    </>
  );
}

/** Только «корона» из листьев агавы. */
export function Crown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={logo.crownBox}
      fill="currentColor"
      aria-hidden="true"
    >
      <CrownParts />
    </svg>
  );
}

/** Полный логотип: корона, рамка-скоба и слово. */
export function LogoLockup({
  animated = false,
  className = "",
}: {
  animated?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`lockup${animated ? " lg-anim" : ""} ${className}`.trim()}
      viewBox={logo.vb}
      fill="currentColor"
      role="img"
      aria-label="Оранжерея"
    >
      <defs>
        <clipPath id={id}>
          <rect
            x={-30}
            y={logo.top - 4}
            width={logo.W + 60}
            height={logo.base + 8}
          />
        </clipPath>
      </defs>
      <g className="lg-crown">
        <CrownParts animated={animated} />
      </g>
      <path className="lg-frame" d={logo.frame} />
      <path className="lg-step" d={logo.step} />
      <g clipPath={`url(#${id})`}>
        {logo.letters.map((d, i) => (
          <path
            key={i}
            className="lg-letter"
            style={vars({ "--i": i })}
            d={d}
          />
        ))}
      </g>
    </svg>
  );
}
