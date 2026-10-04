"use client";
import { useEffect, useRef, useState } from "react";

type Particle = { x: number; y: number; life: number };

export function StarCursor() {
  const [on, setOn] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduced.matches) return;
    setOn(true);
    const particles: Particle[] = [];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let mx = 0;
    let my = 0;
    let raf = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      particles.push({ x: mx, y: my, life: 1 });
      if (particles.length > 28) particles.shift();
    };
    const loop = () => {
      if (canvas && ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.life -= 0.03;
          ctx.beginPath();
          ctx.fillStyle = `rgba(168,85,247,${Math.max(p.life, 0)})`;
          ctx.arc(p.x, p.y, 1.6 * p.life, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;
  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />
      <div ref={cursorRef} className="star-cursor" aria-hidden="true" />
    </>
  );
}
