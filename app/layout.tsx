import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sierra Finance | Get Funded Through Conversation",
  description:
    "Skip the paperwork. Sierra Finance's AI copilot walks you through invoice factoring in minutes, not days.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
