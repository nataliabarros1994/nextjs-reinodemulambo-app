"use client";
import { config } from "@/data/config.js";

export function PrivacySeal() {
  return (
    <div className="selo-faixa" role="note">
      {config.selo}
    </div>
  );
}
