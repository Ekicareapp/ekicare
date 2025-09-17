import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekicare",
  description: "Simplifiez l'accès aux soins équins",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#FAF6F2] text-[#1B263B]">
        {children}
      </body>
    </html>
  );
}
