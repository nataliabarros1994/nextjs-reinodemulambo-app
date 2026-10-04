"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars = Array.from({ length: 70 }, (_, i) => ({
      x: (i * 47 + 13) % 100,
      y: (i * 31 + 7) % 100,
      r: i % 9 === 0 ? 1.4 : 0.6,
      a: 0.25 + (i % 5) * 0.08,
      s: 0.15 + (i % 4) * 0.08,
    }));
    let frame = 0;
    let raf = 0;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      stars.forEach((star, i) => {
        const twinkle = reduced ? 1 : 0.65 + Math.sin(frame / 50 + i) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(245,241,232,${star.a * twinkle})`;
        ctx.arc(
          (star.x / 100) * rect.width,
          (star.y / 100) * rect.height + (reduced ? 0 : Math.sin(frame / 80 + i) * 1.2),
          star.r,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });
      if (!reduced) {
        frame += 1;
        raf = requestAnimationFrame(paint);
      }
    };
    paint();
    window.addEventListener("resize", paint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", paint);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
