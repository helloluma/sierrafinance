"use client";

import { motion } from "motion/react";

type FieldItem = {
  label: string;
  value: string;
};

type BusinessInfoData = {
  companyName: string;
  industry: string;
  icon: string;
  fields: FieldItem[];
};

const ICONS: Record<string, string> = {
  truck: "bx bxs-truck",
  factory: "bx bx-building-house",
  building: "bx bx-buildings",
  briefcase: "bx bx-briefcase",
};

export function BusinessInfoCard({ data }: { data: BusinessInfoData }) {
  return (
    <motion.div
      className="gen-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      {/* Header */}
      <div className="gen-card-header">
        <div className="gen-card-icon">
          <i className={ICONS[data.icon] || ICONS.briefcase} style={{ fontSize: "1.15rem" }} />
        </div>
        <div>
          <div className="gen-card-title">{data.companyName}</div>
          <div className="gen-card-subtitle">{data.industry}</div>
        </div>
      </div>

      {/* Fields grid */}
      <div className="gen-card-grid">
        {data.fields.map((field, i) => (
          <motion.div
            key={field.label}
            className="gen-field"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              delay: 0.08 * i,
            }}
          >
            <div className="gen-field-label">{field.label}</div>
            <div className="gen-field-value">{field.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
