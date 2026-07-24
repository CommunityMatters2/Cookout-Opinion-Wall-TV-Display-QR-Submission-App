import type { Metadata } from "next";
import { Geist, Anton } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000"),
  title: siteConfig.eventTitle,
  description: siteConfig.tagline,
  openGraph: {
    title: siteConfig.shareTitle,
    description: siteConfig.tagline,
    siteName: siteConfig.eventTitle,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.shareTitle,
    description: siteConfig.tagline,
  },
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
      className={`${geistSans.variable} ${anton.variable}`}
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
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
