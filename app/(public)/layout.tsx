import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Chaque page publique expose un <main id="contenu"> comme cible. */}
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
