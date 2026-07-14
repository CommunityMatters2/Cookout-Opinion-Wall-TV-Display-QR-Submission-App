import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.eventTitle,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { colors, cm2 } = siteConfig;
  return (
    <html
      lang="en"
      className={geistSans.variable}
      style={
        {
          "--color-background": colors.background,
          "--color-accent": colors.accent,
          "--color-text": colors.text,
          "--color-card": colors.cardBackground,
          "--color-cm2-teal": cm2.palette.teal,
          "--color-cm2-green": cm2.palette.green,
          "--color-cm2-purple": cm2.palette.purple,
          "--color-cm2-gold": cm2.palette.gold,
          "--color-cm2-navy": cm2.palette.navy,
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
