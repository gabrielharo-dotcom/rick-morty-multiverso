"use client";
import { useEffect, useRef } from "react";
export default function Reveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.dataset.ready = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={`reveal ${className}`}>
      {children}
    </section>
  );
}
