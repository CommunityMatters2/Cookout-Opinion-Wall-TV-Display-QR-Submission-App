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
  const { colors } = siteConfig;
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
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
