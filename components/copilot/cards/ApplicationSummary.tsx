"use client";

import { motion } from "motion/react";

type SummaryData = {
  status: string;
  company: string;
  industry: string;
  monthlyVolume: string;
  estimatedFunding: string;
  advanceRate: string;
  fundingSpeed: string;
  customersApproved: number;
  customersReview: number;
  docsRequired: number;
  docsSubmitted: number;
  nextSteps: string[];
};

export function ApplicationSummary({ data }: { data: SummaryData }) {
  return (
    <motion.div
      className="gen-card gen-card-elevated"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="gen-card-badge">Application Summary</div>
        <motion.div
          className="summary-status-badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
        >
          <span className="status-dot status-dot-success" />
          {data.status}
        </motion.div>
      </div>

      {/* Key metrics row */}
      <div className="summary-metrics">
        <motion.div
          className="summary-metric-main"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="summary-metric-value">{data.estimatedFunding}</div>
          <div className="summary-metric-label">Est. Monthly Funding</div>
        </motion.div>
        <div className="summary-metric-side">
          <div className="summary-metric-sm">
            <span className="summary-metric-sm-value">{data.advanceRate}</span>
            <span className="summary-metric-sm-label">Advance Rate</span>
          </div>
          <div className="summary-metric-sm">
            <span className="summary-metric-sm-value">{data.fundingSpeed}</span>
            <span className="summary-metric-sm-label">Funding Speed</span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="summary-details">
        <div className="summary-detail-row">
          <span className="summary-detail-label">Industry</span>
          <span className="summary-detail-value">{data.industry}</span>
        </div>
        <div className="summary-detail-row">
          <span className="summary-detail-label">Monthly Volume</span>
          <span className="summary-detail-value">{data.monthlyVolume}</span>
        </div>
        <div className="summary-detail-row">
          <span className="summary-detail-label">Customers Approved</span>
          <span className="summary-detail-value text-[var(--color-sf-success)]">
            {data.customersApproved} approved
            {data.customersReview > 0 && (
              <span className="text-[var(--color-sf-warning)]"> · {data.customersReview} in review</span>
            )}
          </span>
        </div>
        <div className="summary-detail-row">
          <span className="summary-detail-label">Documents</span>
          <span className="summary-detail-value">
            {data.docsSubmitted}/{data.docsRequired} submitted
          </span>
        </div>
      </div>

      {/* Next steps */}
      <div className="summary-next-steps">
        <div className="text-[0.65rem] uppercase tracking-[0.1em] font-semibold text-[var(--color-sf-text-tertiary)] mb-2">
          Next Steps
        </div>
        <ol className="summary-steps-list">
          {data.nextSteps.map((step, i) => (
            <motion.li
              key={step}
              className="summary-step-item"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <span className="summary-step-number">{i + 1}</span>
              {step}
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
