import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Théo FERRETE - Développeur Full Stack",
  description: "Portfolio moderne de Théo FERRETE, développeur Full Stack passionné par la création d'expériences web innovantes avec React, Next.js et TypeScript.",
  keywords: ["développeur", "full stack", "react", "next.js", "typescript", "portfolio"],
  authors: [{ name: "Théo FERRETE" }],
  creator: "Théo FERRETE",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Théo FERRETE - Développeur Full Stack",
    description: "Portfolio moderne de développeur Full Stack",
    siteName: "Portfolio Théo FERRETE",
    images: [{ url: "/images/profile/avatar.png", width: 1200, height: 630, alt: "Théo FERRETE - Développeur Full Stack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Théo FERRETE - Développeur Full Stack",
    description: "Portfolio moderne de développeur Full Stack",
    images: ["/images/profile/avatar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
