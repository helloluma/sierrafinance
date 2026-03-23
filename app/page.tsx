"use client";

import { ChatContainer } from "@/components/copilot/ChatContainer";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Ambient background */}
      <div className="ambient-bg" />

      {/* Header */}
      <header className="page-header">
        <img
          src="/sierra-finance-logo.svg"
          alt="Sierra Finance"
          className="header-logo-img"
        />
      </header>

      {/* Hero area */}
      <main className="page-main">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title text-balance">
            Skip the paperwork.
            <br />
            <span className="hero-accent">Get funded through conversation.</span>
          </h1>
          <p className="hero-subtitle text-pretty">
            Our AI copilot replaces the traditional application form. Answer a
            few questions, get a funding estimate in minutes.
          </p>
        </motion.div>

        {/* Chat copilot */}
        <motion.div
          className="chat-wrapper"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            delay: 0.2,
          }}
        >
          <ChatContainer />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <span>&copy; 2026 All Rights Reserved</span>
        <span className="footer-dot">|</span>
        <a href="https://www.sierra.finance" className="footer-link">Sierra Finance</a>
        <span className="footer-dot">|</span>
        <a href="https://www.sierra.finance/privacy" className="footer-link">Privacy</a>
        <span className="footer-dot">|</span>
        <a href="https://www.highdesertcap.com/" className="footer-link">High Desert Capital</a>
      </footer>
    </div>
  );
}
