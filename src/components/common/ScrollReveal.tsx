import React from "react";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "fade-up" | "fade" | "scale";
  delay?: 0 | 100 | 200 | 300 | 400;
  className?: string;
  as?: React.ElementType;
}

/**
 * ScrollReveal:
 * Server-Component safe wrapper for smooth broadsheet editorial scroll reveals.
 * Renders standard semantic HTML markup with CSS animation classes.
 * Relies on the global <ScrollObserver /> mounted at root layout.
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  as: Component = "div",
  ...props
}: ScrollRevealProps) {
  const animClass =
    animation === "fade"
      ? "scroll-reveal-fade"
      : animation === "scale"
        ? "scroll-reveal-scale"
        : "scroll-reveal";

  const delayClass = delay > 0 ? `scroll-delay-${delay}` : "";

  return (
    <Component
      className={`${animClass} ${delayClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
