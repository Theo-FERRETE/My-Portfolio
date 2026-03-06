import type { Metadata } from "next";
import AuthProvider from "@/app/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Admin - Portfolio",
  description: "Interface d'administration du portfolio",
  robots: "noindex, nofollow", // Empêche l'indexation par les moteurs de recherche
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
