"use client";

import { motion, AnimatePresence } from "motion/react";
import type { QuickReply } from "@/lib/chat-flow";

type QuickRepliesProps = {
  replies: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function QuickReplies({ replies, onSelect, disabled }: QuickRepliesProps) {
  if (!replies.length || disabled) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="quick-replies"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
      >
        {replies.map((qr, i) => (
          <motion.button
            key={`${qr.value}-${i}`}
            className="quick-reply-btn"
            onClick={() => onSelect(qr.value)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: i * 0.06,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {qr.icon && <i className={qr.icon} style={{ fontSize: "0.85rem" }} />}
            {qr.label}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
