"use client";

import { useEffect, useState } from "react";
import { simferopolNow } from "@/lib/hours";

export function HoursList({
  rows,
}: {
  rows: { label: string; days: number[]; time: string }[];
}) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(simferopolNow().day), []);
  return (
    <dl className="hours">
      {rows.map((r) => (
        <div
          key={r.label}
          data-today={today !== null && r.days.includes(today) ? "true" : undefined}
        >
          <dt>{r.label}</dt>
          <dd>{r.time}</dd>
        </div>
      ))}
    </dl>
  );
}
