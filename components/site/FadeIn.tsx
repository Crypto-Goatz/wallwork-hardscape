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
  once?: boolean;
  as?: React.ElementType;
}

const directionMap: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 600,
  threshold = 0.12,
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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const translateClass = directionMap[direction];

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : undefined,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        ...(visible
          ? {}
          : {
              transform:
                direction === "up"
                  ? "translateY(2rem)"
                  : direction === "down"
                  ? "translateY(-2rem)"
                  : direction === "left"
                  ? "translateX(2rem)"
                  : direction === "right"
                  ? "translateX(-2rem)"
                  : "none",
            }),
      }}
    >
      {children}
    </Tag>
  );
}
