"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 38,
    restDelta: 0.002,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-brand-secondary origin-left z-[9999]"
      style={{ scaleX }}
    />
  );
}
