"use client";
import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="absolute right-3 top-3 p-2 text-dourado" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
        {title ? (
          <h2 id="modal-title" className="font-display mb-3 pr-8 text-3xl">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
