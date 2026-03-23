import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sierra Finance | Invoice Factoring Made Simple",
  description:
    "Turn your unpaid invoices into same-day cash. Sierra Finance walks you through invoice factoring in minutes, not days.",
  openGraph: {
    title: "Sierra Finance | Invoice Factoring Made Simple",
    description:
      "Stop waiting 60 days to get paid. Turn your unpaid invoices into same-day cash with Sierra Finance.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Sierra Finance",
      },
    ],
    type: "website",
    siteName: "Sierra Finance",
  },
  metadataBase: new URL("https://sierrafinance.vercel.app"),
  other: {
    "theme-color": "#1a2749",
    "msapplication-TileColor": "#1a2749",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sierra Finance | Invoice Factoring Made Simple",
    description:
      "Stop waiting 60 days to get paid. Turn your unpaid invoices into same-day cash with Sierra Finance.",
    images: ["/opengraph.png"],
  },
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
