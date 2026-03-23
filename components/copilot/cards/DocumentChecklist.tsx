"use client";

import { motion } from "motion/react";

type DocItem = {
  name: string;
  status: "required" | "optional" | "uploaded";
  description: string;
};

type DocumentChecklistData = {
  documents: DocItem[];
};

const STATUS_ICON = {
  required: (
    <div className="doc-icon doc-icon-required">
      <i className="bx bx-info-circle" style={{ fontSize: "0.95rem" }} />
    </div>
  ),
  optional: (
    <div className="doc-icon doc-icon-optional">
      <i className="bx bx-minus-circle" style={{ fontSize: "0.95rem" }} />
    </div>
  ),
  uploaded: (
    <div className="doc-icon doc-icon-uploaded">
      <i className="bx bx-check-circle" style={{ fontSize: "0.95rem" }} />
    </div>
  ),
};

export function DocumentChecklist({ data }: { data: DocumentChecklistData }) {
  const required = data.documents.filter((d) => d.status === "required").length;
  const optional = data.documents.filter((d) => d.status === "optional").length;

  return (
    <motion.div
      className="gen-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <div className="gen-card-header-sm">
        <div className="gen-card-badge">Document Checklist</div>
        <span className="text-[0.65rem] text-[var(--color-sf-text-tertiary)]">
          {required} required · {optional} optional
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {data.documents.map((doc, i) => (
          <motion.div
            key={doc.name}
            className="doc-row"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              delay: 0.07 * i,
            }}
          >
            {STATUS_ICON[doc.status]}
            <div className="flex-1 min-w-0">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-desc">{doc.description}</div>
            </div>
            <span
              className={`doc-status-label ${
                doc.status === "required" ? "doc-status-required" : "doc-status-optional"
              }`}
            >
              {doc.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
