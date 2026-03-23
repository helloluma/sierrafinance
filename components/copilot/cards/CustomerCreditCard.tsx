"use client";

import { motion } from "motion/react";

type Customer = {
  name: string;
  creditScore: string;
  status: "approved" | "review" | "denied";
  payHistory: string;
  avgPayDays: number;
};

type CustomerCreditData = {
  customers: Customer[];
};

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    dotClass: "status-dot-success",
    badgeClass: "badge-success",
  },
  review: {
    label: "In Review",
    dotClass: "status-dot-warning",
    badgeClass: "badge-warning",
  },
  denied: {
    label: "Denied",
    dotClass: "status-dot-error",
    badgeClass: "badge-error",
  },
};

export function CustomerCreditCard({ data }: { data: CustomerCreditData }) {
  return (
    <motion.div
      className="gen-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <div className="gen-card-header-sm">
        <div className="gen-card-badge">Credit Verification</div>
      </div>

      <div className="gen-table">
        <div className="gen-table-header">
          <span>Customer</span>
          <span>Credit</span>
          <span>Pay History</span>
          <span>Status</span>
        </div>
        {data.customers.map((customer, i) => {
          const cfg = STATUS_CONFIG[customer.status];
          return (
            <motion.div
              key={customer.name}
              className="gen-table-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                delay: 0.1 * i,
              }}
            >
              <span className="gen-table-cell-primary">
                {customer.name}
              </span>
              <span className="gen-table-cell font-mono text-xs">
                {customer.creditScore}
              </span>
              <span className="gen-table-cell">
                {customer.payHistory}
                <span className="text-[var(--color-sf-text-tertiary)] text-[0.65rem] ml-1">
                  ({customer.avgPayDays}d avg)
                </span>
              </span>
              <span className={`gen-badge ${cfg.badgeClass}`}>
                <span className={`status-dot ${cfg.dotClass}`} />
                {cfg.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
