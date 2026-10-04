"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export function Accordion({
  items,
}: {
  items: Array<{ pergunta: string; resposta: string }>;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {items.map((item, index) => (
        <div className="faq-item" key={item.pergunta}>
          <button
            className="faq-trigger"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? null : index)}
          >
            <span>{item.pergunta}</span>
            <Plus
              size={18}
              className="shrink-0 text-dourado transition-transform"
              style={{ transform: open === index ? "rotate(45deg)" : undefined }}
            />
          </button>
          {open === index ? (
            <p className="pb-5 pr-8 text-sm leading-7 text-branco-lua/65">{item.resposta}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
