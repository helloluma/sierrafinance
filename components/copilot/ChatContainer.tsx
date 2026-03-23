"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { BusinessInfoCard } from "./cards/BusinessInfoCard";
import { FundingEstimateCard } from "./cards/FundingEstimateCard";
import { CustomerCreditCard } from "./cards/CustomerCreditCard";
import { DocumentChecklist } from "./cards/DocumentChecklist";
import { ProgressCard } from "./cards/ProgressCard";
import { ApplicationSummary } from "./cards/ApplicationSummary";
import {
  CONVERSATION_STEPS,
  FALLBACK_RESPONSE,
  findBestMatch,
  type BotResponse,
  type CardData,
  type QuickReply,
} from "@/lib/chat-flow";

function renderCard(card: CardData): ReactNode {
  switch (card.type) {
    case "business-info":
      return <BusinessInfoCard data={card.data as any} />;
    case "funding-estimate":
      return <FundingEstimateCard data={card.data as any} />;
    case "customer-credit":
      return <CustomerCreditCard data={card.data as any} />;
    case "document-checklist":
      return <DocumentChecklist data={card.data as any} />;
    case "progress":
      return <ProgressCard data={card.data as any} />;
    case "application-summary":
      return <ApplicationSummary data={card.data as any} />;
    default:
      return null;
  }
}

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentQuickReplies, setCurrentQuickReplies] = useState<QuickReply[]>(
    []
  );
  const [inputDisabled, setInputDisabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Initial greeting
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    const timer = setTimeout(() => {
      addBotMessage(
        CONVERSATION_STEPS.find((s) => s.id === "welcome")!.response
      );
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  function addBotMessage(response: BotResponse) {
    setIsThinking(true);
    setInputDisabled(true);
    setCurrentQuickReplies([]);

    const thinkDelay = 600 + Math.random() * 400;

    setTimeout(() => {
      setIsThinking(false);

      const msgId = Date.now().toString();
      const newMsg: ChatMessageData = {
        id: msgId,
        role: "bot",
        text: response.text,
        conclusion: response.conclusion,
        card: response.card ? renderCard(response.card) : undefined,
        streamComplete: false,
        conclusionComplete: false,
      };

      setMessages((prev) => [...prev, newMsg]);
    }, thinkDelay);
  }

  function handleTextComplete(msgId: string, response: BotResponse) {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streamComplete: true } : m))
    );
    // If no card and no conclusion, enable input immediately
    if (!response.card && !response.conclusion) {
      setInputDisabled(false);
      setCurrentQuickReplies(response.quickReplies || []);
    }
  }

  function handleConclusionComplete(msgId: string, response: BotResponse) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, conclusionComplete: true } : m
      )
    );
    setInputDisabled(false);
    setCurrentQuickReplies(response.quickReplies || []);
  }

  function handleSend(input: string) {
    // Add user message
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
      streamComplete: true,
      conclusionComplete: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentQuickReplies([]);

    // Find matching response
    const match = findBestMatch(input, CONVERSATION_STEPS);
    const response = match ? match.response : FALLBACK_RESPONSE;

    addBotMessage(response);
  }

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-[var(--color-sf-text)]">
              Sierra Finance Copilot
            </div>
            <div className="text-[0.65rem] text-[var(--color-sf-text-tertiary)] flex items-center gap-1.5">
              <span className="status-dot status-dot-success" />
              Online
            </div>
          </div>
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.12em] font-semibold text-[var(--color-sf-text-tertiary)]">
          Demo
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="chat-messages">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => {
            // Find the response that generated this bot message for callbacks
            const matchingStep = msg.role === "bot"
              ? CONVERSATION_STEPS.find((s) =>
                  s.response.text === msg.text
                )
              : null;
            const response = matchingStep?.response || (
              msg.role === "bot" && msg.text === FALLBACK_RESPONSE.text
                ? FALLBACK_RESPONSE
                : null
            );

            return (
              <ChatMessage
                key={msg.id}
                message={msg}
                onTextComplete={() => {
                  if (response) {
                    handleTextComplete(msg.id, response);
                  } else {
                    // Fallback: mark complete and enable input
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === msg.id
                          ? { ...m, streamComplete: true, conclusionComplete: true }
                          : m
                      )
                    );
                    setInputDisabled(false);
                  }
                }}
                onConclusionComplete={() => {
                  if (response) {
                    handleConclusionComplete(msg.id, response);
                  } else {
                    setInputDisabled(false);
                  }
                }}
              />
            );
          })}
        </AnimatePresence>

        {isThinking && <ThinkingIndicator />}
      </div>

      {/* Input area */}
      <ChatInput
        onSend={handleSend}
        quickReplies={currentQuickReplies}
        disabled={inputDisabled}
      />
    </div>
  );
}
