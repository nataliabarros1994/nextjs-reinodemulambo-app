"use client";
export function ShellIllustration({ className = "h-10 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 52" aria-hidden="true">
      <path
        d="M6 44C7 30 9 14 20 7c11 7 13 23 14 37-8 3-20 3-28 0Z"
        fill="currentColor"
        opacity=".2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M20 8v36M13 14c4 8 5 18 4 29M27 14c-4 8-5 18-4 29M9 23c3 3 5 5 7 6M31 23c-3 3-5 5-7 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function TarotMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="m50 18 7.4 22.6H81L59 54l8.2 25L50 64 32.8 79 41 54 19 40.6h23.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function MoonMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M40 12a24 24 0 1 0 10 42 20 20 0 0 1-10-42Z" fill="currentColor" opacity=".85" />
    </svg>
  );
}
