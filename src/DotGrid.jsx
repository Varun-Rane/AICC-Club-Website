'use client';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

/* ================= HELPERS ================= */
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

/* ================= COMPONENT ================= */
const DotGrid = ({
  dotSize = 8,
  gap = 22,
  baseColor = 'rgba(255,255,255,0.001)',
  activeColor = '#FFFFFF',
  proximity = 140,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style,
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const exportingRef = useRef(false); // 🔥 IMPORTANT

  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  /* ================= EXPORT MODE DETECTION ================= */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      exportingRef.current = document.body.classList.contains('exporting');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    exportingRef.current = document.body.classList.contains('exporting');
    return () => observer.disconnect();
  }, []);

  const baseRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);
  const activeRgb = baseRgb;

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  /* ================= GRID BUILD ================= */
  const buildGrid = useCallback(() => {
    if (exportingRef.current) return;
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.floor((rect.width + gap) / (dotSize + gap));
    const rows = Math.floor((rect.height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const startX = (rect.width - (cols * cell - gap)) / 2 + dotSize / 2;
    const startY = (rect.height - (rows * cell - gap)) / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false,
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  /* ================= DRAW ================= */
  useEffect(() => {
    if (!circlePath) return;
    let raf;

    const draw = () => {
      if (exportingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const dx = dot.cx - x;
        const dy = dot.cy - y;
        const dist = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - dist / proximity);

        ctx.save();
        ctx.translate(dot.cx + dot.xOffset, dot.cy + dot.yOffset);
        ctx.fillStyle = `rgb(${255 * t},${255 * t},${255 * t})`;
        ctx.fill(circlePath);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [circlePath, proximity]);

  /* ================= EVENTS ================= */
  useEffect(() => {
    const onMove = (e) => {
      if (exportingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (!rect) return;

      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
    };

    const throttled = throttle(onMove, 50);
    window.addEventListener('mousemove', throttled, { passive: true });
    return () => window.removeEventListener('mousemove', throttled);
  }, []);

  /* ================= RESIZE ================= */
  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    wrapperRef.current && ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [buildGrid]);

  return (
    <section
      className={`dot-grid absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </section>
  );
};

export default DotGrid;
