"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { QuickReply } from "@/lib/chat-flow";

type ChatInputProps = {
  onSend: (message: string) => void;
  quickReplies?: QuickReply[];
  disabled?: boolean;
};

export function ChatInput({ onSend, quickReplies, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-area">
      {/* Quick Replies */}
      <AnimatePresence mode="popLayout">
        {quickReplies && quickReplies.length > 0 && !disabled && (
          <motion.div
            className="quick-replies"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            {quickReplies.map((qr, i) => (
              <motion.button
                key={qr.value}
                className="quick-reply-btn"
                onClick={() => onSend(qr.value)}
                disabled={disabled}
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
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="chat-textarea"
        />
        <motion.button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          <i className="bx bx-send" style={{ fontSize: "1.1rem" }} />
        </motion.button>
      </div>
    </div>
  );
}
