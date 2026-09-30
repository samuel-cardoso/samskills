"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Entrance animation driven by IntersectionObserver.
 *
 * Deliberately not GSAP ScrollTrigger: ScrollTrigger's `onEnter` only fires when
 * the scroll position *crosses* the start point, so anything already above the
 * fold on load never animates and stays at opacity 0. IntersectionObserver
 * reports the initial state on observe(), so content visible at load reveals
 * immediately.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${distance}px, 0)`,
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
