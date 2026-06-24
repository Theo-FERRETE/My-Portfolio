import type { Metadata } from "next";
import AuthProvider from "@/app/components/providers/AuthProvider";
import { AdminThemeProvider } from "@/app/admin/_theme/AdminThemeProvider";
import "./admin-theme.css";

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
  return (
    <AuthProvider>
      <AdminThemeProvider>{children}</AdminThemeProvider>
    </AuthProvider>
  );
}
