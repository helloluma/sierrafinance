"use client";

import { motion } from "motion/react";

type Step = {
  label: string;
  status: "complete" | "current" | "upcoming";
};

type ProgressData = {
  steps: Step[];
  progress: number;
};

export function ProgressCard({ data }: { data: ProgressData }) {
  return (
    <motion.div
      className="gen-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <div className="gen-card-header-sm">
        <div className="gen-card-badge">Application Progress</div>
        <span className="text-sm font-mono font-medium text-[var(--color-sf-accent)] tabular-nums">
          {data.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${data.progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>

      {/* Steps */}
      <div className="progress-steps">
        {data.steps.map((step, i) => (
          <motion.div
            key={step.label}
            className={`progress-step progress-step-${step.status}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <div className={`progress-dot progress-dot-${step.status}`}>
              {step.status === "complete" && (
                <i className="bx bx-check" style={{ fontSize: "0.75rem" }} />
              )}
            </div>
            <span className="progress-step-label">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
