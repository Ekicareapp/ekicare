import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import NotificationContainer from "@/app/components/ui/NotificationContainer";

export const metadata: Metadata = {
  title: "Ekicare",
  description: "Simplifiez l'accès aux soins équins",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#FAF6F2] text-[#1B263B]">
        <AuthProvider>
          {children}
          <NotificationContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
