import type { Day } from "./types";

const mins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
const norm = (d: Day) => ({ open: mins(d.open), close: mins(d.close) === 0 ? 1440 : mins(d.close), closed: !!d.closed });
const fmt = (m: number) =>
  m >= 1440 ? "00:00" : `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const FULL = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Время в Симферополе, где бы ни был гость. */
export function simferopolNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Simferopol", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: Math.max(0, EN.indexOf(get("weekday"))), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function openStatus(hours: Day[], date = new Date()) {
  const { day, minutes } = simferopolNow(date);
  const t = norm(hours[day]);
  if (!t.closed && minutes >= t.open && minutes < t.close)
    return { day, open: true, label: `Открыто до ${fmt(t.close)}` };
  if (!t.closed && minutes < t.open)
    return { day, open: false, label: `Откроемся сегодня в ${fmt(t.open)}` };
  for (let i = 1; i <= 7; i++) {
    const n = norm(hours[(day + i) % 7]);
    if (!n.closed)
      return { day, open: false, label: `Откроемся ${i === 1 ? "завтра" : FULL[(day + i) % 7].toLowerCase()} в ${fmt(n.open)}`.replace("в воскресенье", "в воскресенье") };
  }
  return { day, open: false, label: "Сейчас закрыто" };
}

/** Строки для таблицы: соседние дни с одинаковым временем объединяются. */
export function hoursRows(hours: Day[]) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows: { label: string; days: number[]; time: string }[] = [];
  for (const d of order) {
    const h = hours[d];
    const time = h.closed ? "Выходной" : `${h.open} — ${h.close}`;
    const last = rows[rows.length - 1];
    if (last && last.time === time) last.days.push(d);
    else rows.push({ label: "", days: [d], time });
  }
  for (const r of rows)
    r.label = r.days.length === 1 ? FULL[r.days[0]] : `${SHORT[r.days[0]]} — ${SHORT[r.days[r.days.length - 1]].toLowerCase()}`;
  return rows;
}
