"use client";

import { useEffect, useState } from "react";
import { openStatus } from "@/lib/hours";

export function useOpenStatus() {
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(
    null,
  );
  useEffect(() => {
    const tick = () => setStatus(openStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

/** Точка «открыто сейчас» с подписью; до гидратации не занимает места. */
export function OpenNow({ className = "" }: { className?: string }) {
  const status = useOpenStatus();
  return (
    <span
      className={`open-now ${className}`.trim()}
      data-open={status ? String(status.open) : undefined}
      aria-live="polite"
    >
      <i aria-hidden="true" />
      {status?.label ?? "\u00a0"}
    </span>
  );
}
