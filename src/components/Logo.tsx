"use client";
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#0A0A0A" stroke="#C9A227" strokeWidth="1.2" />
      <path
        d="M40 12c-12 2.2-22 13-22 24s10 22 22 24C24 57 14 45 14 36S24 14 40 12Z"
        fill="#C9A227"
        opacity="0.9"
      />
      <path
        d="M28 38c1-8 4-14 10-18-1 7 1 13-2 19-2 5-6 8-11 9 4-2 6-6 3-10Z"
        fill="#6B21A8"
      />
      <text
        x="34"
        y="40"
        textAnchor="middle"
        fill="#F5F1E8"
        fontFamily="Cinzel, Georgia, serif"
        fontSize="11"
        letterSpacing="1"
      >
        MN
      </text>
    </svg>
  );
}
