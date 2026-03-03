"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  as?: React.ElementType;
}

const TRANSLATE_PX = 28; // subtle — not too dramatic

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 800,
  threshold = 0.08,
  rootMargin = "0px 0px -60px 0px",
  once = true,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const getInitialTransform = () => {
    if (visible) return "translate3d(0,0,0)";
    switch (direction) {
      case "up":    return `translate3d(0,${TRANSLATE_PX}px,0)`;
      case "down":  return `translate3d(0,-${TRANSLATE_PX}px,0)`;
      case "left":  return `translate3d(${TRANSLATE_PX}px,0,0)`;
      case "right": return `translate3d(-${TRANSLATE_PX}px,0,0)`;
      default:      return "translate3d(0,0,0)";
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: getInitialTransform(),
        // "will-change" avoids paint on compositing layers
        willChange: visible ? "auto" : "opacity, transform",
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        // Custom spring-like easing: slow start → fast middle → gentle settle
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
