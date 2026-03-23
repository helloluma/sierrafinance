import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sierra Finance | Invoice Factoring Made Simple",
  description:
    "Turn your unpaid invoices into same-day cash. Sierra Finance walks you through invoice factoring in minutes, not days.",
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
