import type { Metadata } from "next";
import { JetBrains_Mono, Figtree } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/providers/AuthProvider";
import { SITE_URL } from "@/lib/site-url";
import { getProfile } from "@/lib/data";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    url: SITE_URL,
    image: `${SITE_URL}/images/profile/avatar.png`,
    email: profile.email || undefined,
    address: profile.location
      ? { '@type': 'PostalAddress', addressLocality: profile.location }
      : undefined,
    sameAs: [profile.github, profile.linkedin, profile.twitter].filter(Boolean),
  };

  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} ${figtree.variable} antialiased`}>
        <script
          type="application/ld+json"
          // Échappe `<` pour empêcher toute clôture prématurée de la balise <script>
          // si jamais un champ texte (bio...) contenait "</script>".
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
