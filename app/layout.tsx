import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahil Chambyal | AI/ML Engineer Portfolio",
  description: "AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.",
  keywords: ["AI", "ML", "Machine Learning", "Deep Learning", "Python", "Portfolio", "Sahil Chambyal"],
  authors: [{ name: "Sahil Chambyal" }],
  openGraph: {
    title: "Sahil Chambyal | AI/ML Engineer Portfolio",
    description: "AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahil Chambyal | AI/ML Engineer Portfolio",
    description: "AI/ML Engineer developing scalable AI/ML and intelligent systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
