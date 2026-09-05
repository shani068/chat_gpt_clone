import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { APP_DESCRIPTION, APP_NAME } from "@/constants/config";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_DESCRIPTION}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "A fast, focused AI assistant. File analysis, markdown and code, and streamed answers — in an interface that stays out of the way.",
  applicationName: APP_NAME,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches the app background so mobile browser chrome does not clash.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes writes the theme class before paint.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
