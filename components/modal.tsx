"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/** Диалог с плавным открытием и закрытием. variant: dialog | wide | drawer. */
export function Modal({
  children,
  onClose,
  label,
  variant = "dialog",
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  variant?: "dialog" | "wide" | "drawer";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    const before = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = before;
      if (previouslyFocused instanceof HTMLElement)
        previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`modal modal-${variant}`}
      data-closing={closing || undefined}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            requestClose();
        }
      }}
    >
      <button className="round close" onClick={requestClose} aria-label="Закрыть">
        <X size={20} />
      </button>
      {children}
    </dialog>
  );
}
