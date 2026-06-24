import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/providers/AuthProvider";
import { ThemeProvider } from "@/app/components/providers/ThemeProvider";
import { THEMES, isTheme, type Theme } from "@/app/components/providers/theme-constants";
import { getSiteSettings } from "@/lib/data/data-helpers";

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

const VALID_THEMES = THEMES.map((t) => t.value);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let defaultTheme: Theme = 'obsidian';
  try {
    const settings = await getSiteSettings();
    if (isTheme(settings.defaultTheme)) defaultTheme = settings.defaultTheme;
  } catch (error) {
    console.error('Erreur récupération du thème par défaut:', error);
  }

  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Anti-flash : applique le thème (préférence visiteur ou défaut serveur) avant l'hydratation React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var valid=${JSON.stringify(VALID_THEMES)};var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',valid.indexOf(t)!==-1?t:${JSON.stringify(defaultTheme)});}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme={defaultTheme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
