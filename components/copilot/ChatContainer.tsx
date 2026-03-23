"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { ChatInput, type AttachedFile } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
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
  OFF_TOPIC_RESPONSE,
  findBestMatch,
  isOffTopic,
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
    CONVERSATION_STEPS.find((s) => s.id === "welcome")?.response.quickReplies || []
  );
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const dragCounterRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0 || isThinking;

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles: AttachedFile[] = files.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  function handleRemoveFile(index: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFilesAdded(files: AttachedFile[]) {
    setAttachedFiles((prev) => [...prev, ...files]);
  }

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
  }, [messages, isThinking, currentQuickReplies, scrollToBottom]);

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
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
      streamComplete: true,
      conclusionComplete: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentQuickReplies([]);
    setAttachedFiles([]);

    // Check off-topic first, then try matching
    if (isOffTopic(input)) {
      addBotMessage(OFF_TOPIC_RESPONSE);
    } else {
      const match = findBestMatch(input, CONVERSATION_STEPS);
      const response = match ? match.response : FALLBACK_RESPONSE;
      addBotMessage(response);
    }
  }

  return (
    <div
      className="app-drop-target"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="drop-zone-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="drop-zone-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <svg className="drop-zone-border" preserveAspectRatio="none">
                <rect x="1.5" y="1.5" rx="24" ry="24" />
              </svg>
              <motion.div
                className="drop-zone-icon"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <i className="bx bx-cloud-upload" style={{ fontSize: "3.5rem" }} />
              </motion.div>
              <div className="drop-zone-text">Drop files here</div>
              <div className="drop-zone-hint">Invoices, AR reports, tax documents</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed header — only in chat mode */}
      {hasMessages && (
        <header className="app-header">
          <img
            src="/sierra-finance-logo.svg"
            alt="Sierra Finance"
            className="header-logo-img"
          />
        </header>
      )}

      {!hasMessages ? (
        /* ══ WELCOME STATE: everything centered ══ */
        <div className="app-content">
          <motion.div
            className="welcome-area"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/sierra-finance-logo.svg"
              alt="Sierra Finance"
              className="welcome-logo"
            />
            <h1 className="hero-title text-balance">
              Stop waiting 60 days
              <br />
              <span className="hero-accent">to get paid.</span>
            </h1>
            <p className="hero-subtitle text-pretty">
              Turn your unpaid invoices into same-day cash. Answer a few
              questions below and get a funding estimate in under 3 minutes.
            </p>

            <div className="welcome-input">
              <QuickReplies
                replies={currentQuickReplies}
                onSelect={handleSend}
              />
              <div className="welcome-textbox">
                <ChatInput onSend={handleSend} disabled={inputDisabled} attachedFiles={attachedFiles} onRemoveFile={handleRemoveFile} onFilesAdded={handleFilesAdded} />
              </div>
            </div>
          </motion.div>

        </div>
      ) : (
        /* ══ CHAT STATE: full viewport messages + bottom input ══ */
        <>
          <div ref={scrollRef} className="app-content">
            <div className="messages-area">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => {
                  const matchingStep =
                    msg.role === "bot"
                      ? CONVERSATION_STEPS.find(
                          (s) => s.response.text === msg.text
                        )
                      : null;
                  const response =
                    matchingStep?.response ||
                    (msg.role === "bot" && msg.text === FALLBACK_RESPONSE.text
                      ? FALLBACK_RESPONSE
                      : null);

                  return (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onTextComplete={() => {
                        if (response) {
                          handleTextComplete(msg.id, response);
                        } else {
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

              {/* Quick replies inline after messages */}
              <QuickReplies
                replies={currentQuickReplies}
                onSelect={handleSend}
                disabled={inputDisabled}
              />
            </div>
          </div>

          <div className="app-input-area">
            <div className="app-input-inner">
              <ChatInput onSend={handleSend} disabled={inputDisabled} attachedFiles={attachedFiles} onRemoveFile={handleRemoveFile} onFilesAdded={handleFilesAdded} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
