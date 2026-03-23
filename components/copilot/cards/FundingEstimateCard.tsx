"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

type Metric = {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  highlight?: boolean;
};

type FundingEstimateData = {
  metrics: Metric[];
};

function AnimatedNumber({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState(value);
  const numMatch = value.match(/[\d,]+/);

  useEffect(() => {
    if (!numMatch) {
      setDisplayed(value);
      return;
    }
    const target = parseInt(numMatch[0].replace(/,/g, ""), 10);
    if (isNaN(target)) {
      setDisplayed(value);
      return;
    }
    const mv = { val: 0 };
    const prefix = value.slice(0, value.indexOf(numMatch[0]));
    const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);

    const controls = animate(mv, { val: target }, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: () => {
        const formatted = Math.round(mv.val).toLocaleString();
        setDisplayed(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{displayed}</span>;
}

const METRIC_ICONS: Record<string, string> = {
  receipt: "bx bx-receipt",
  percent: "bx bx-percent",
  zap: "bx bx-bolt-circle",
  tag: "bx bx-purchase-tag",
};

export function FundingEstimateCard({ data }: { data: FundingEstimateData }) {
  return (
    <motion.div
      className="gen-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <div className="gen-card-header-sm">
        <div className="gen-card-badge">Funding Estimate</div>
      </div>

      <div className="gen-metrics-grid">
        {data.metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            className={`gen-metric ${metric.highlight ? "gen-metric-highlight" : ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              delay: 0.1 * i,
            }}
          >
            <div className="gen-metric-icon">
              <i className={METRIC_ICONS[metric.icon] || METRIC_ICONS.receipt} style={{ fontSize: "1rem" }} />
            </div>
            <div className="gen-metric-value">
              <AnimatedNumber value={metric.value} />
            </div>
            <div className="gen-metric-label">{metric.label}</div>
            {metric.trend && (
              <div className="gen-metric-trend">{metric.trend}</div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
