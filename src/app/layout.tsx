import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { Providers } from "@/app/providers";

import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV.DEV Portfolio",
  description:
    "Modern claymorphism portfolio with Next.js, MongoDB, secure admin dashboard, and deploy-ready APIs.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} h-full`}
    >
      <body suppressHydrationWarning className="min-h-full font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
