"use client";

import { motion } from "motion/react";
import { StreamingText } from "./StreamingText";
import type { ReactNode } from "react";

export type MessageRole = "user" | "bot";

export type ChatMessageData = {
  id: string;
  role: MessageRole;
  text: string;
  conclusion?: string;
  card?: ReactNode;
  streamComplete?: boolean;
  conclusionComplete?: boolean;
};

type ChatMessageProps = {
  message: ChatMessageData;
  onTextComplete?: () => void;
  onConclusionComplete?: () => void;
};

export function ChatMessage({
  message,
  onTextComplete,
  onConclusionComplete,
}: ChatMessageProps) {
  const isBot = message.role === "bot";

  if (!isBot) {
    return (
      <motion.div
        className="flex justify-end px-4 py-1.5"
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
      >
        <div className="user-bubble">{message.text}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-2 px-4 py-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      {/* Bot text */}
      <div className="px-1">
        <div className="bot-text text-pretty">
          {message.streamComplete ? (
            <span>{message.text}</span>
          ) : (
            <StreamingText
              text={message.text}
              speed={16}
              onComplete={onTextComplete}
            />
          )}
        </div>
      </div>

      {/* Generative UI Card */}
      {message.card && message.streamComplete && (
        <motion.div
          className="px-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 350,
            delay: 0.15,
          }}
        >
          {message.card}
        </motion.div>
      )}

      {/* Conclusion text */}
      {message.conclusion && message.streamComplete && (
        <div className="px-1 bot-text text-pretty">
          {message.conclusionComplete ? (
            <span>{message.conclusion}</span>
          ) : (
            <StreamingText
              text={message.conclusion}
              speed={16}
              onComplete={onConclusionComplete}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
