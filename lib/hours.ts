// Крым живёт по московскому времени, но считаем по зоне Симферополя —
// так статус верный, где бы ни был гость.
const M = (h: number, m = 0) => h * 60 + m;

/** Индекс = JS getDay(): 0 — воскресенье. */
export const schedule = [
  { open: M(10), close: M(23) },
  { open: M(12), close: M(23) },
  { open: M(10), close: M(23) },
  { open: M(10), close: M(23) },
  { open: M(10), close: M(23) },
  { open: M(10), close: M(24) },
  { open: M(10), close: M(24) },
];

export const hoursRows = [
  { label: "Понедельник", days: [1], time: "12:00 — 23:00" },
  { label: "Вт — чт, вс", days: [2, 3, 4, 0], time: "10:00 — 23:00" },
  { label: "Пт — сб", days: [5, 6], time: "10:00 — 00:00" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fmt = (m: number) =>
  m >= 1440
    ? "00:00"
    : `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function simferopolNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Simferopol",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: Math.max(0, DAYS.indexOf(get("weekday"))),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function openStatus(date = new Date()) {
  const { day, minutes } = simferopolNow(date);
  const today = schedule[day];
  if (minutes >= today.open && minutes < today.close)
    return { day, open: true, label: `Открыто до ${fmt(today.close)}` };
  if (minutes < today.open)
    return { day, open: false, label: `Откроемся сегодня в ${fmt(today.open)}` };
  const next = schedule[(day + 1) % 7];
  return { day, open: false, label: `Откроемся завтра в ${fmt(next.open)}` };
}
