"use client";
import { type ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  lede,
  center,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="font-display mt-3 text-[1.75rem] leading-tight md:text-4xl">{title}</h2>
      {lede ? (
        <p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-branco-lua/70">{lede}</p>
      ) : null}
    </div>
  );
}
