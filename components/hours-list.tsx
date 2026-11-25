"use client";

import { useEffect, useState } from "react";
import { hoursRows, simferopolNow } from "@/lib/hours";
import { useSite } from "./site-context";

export function HoursList() {
  const { hours } = useSite();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(simferopolNow().day), []);
  return (
    <dl className="hours">
      {hoursRows(hours).map((r) => (
        <div key={r.label} data-today={today !== null && r.days.includes(today) ? "true" : undefined}>
          <dt>{r.label}</dt>
          <dd>{r.time}</dd>
        </div>
      ))}
    </dl>
  );
}
