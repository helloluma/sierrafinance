"use client";

import { motion } from "motion/react";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-sf-text-tertiary)]"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
