"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Récupérer les informations stockées lors de l'inscription
    const name = localStorage.getItem("confirmation_name");
    const email = localStorage.getItem("confirmation_email");
    const role = localStorage.getItem("confirmation_role");

    if (name && email && role) {
      setUserInfo({ name, email, role });
      // Nettoyer le localStorage
      localStorage.removeItem("confirmation_name");
      localStorage.removeItem("confirmation_email");
      localStorage.removeItem("confirmation_role");
    } else {
      // Si pas d'infos, rediriger vers l'onboarding
      router.push("/onboarding");
    }
  }, [router]);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F2] to-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F86F4D] mx-auto"></div>
          <p className="mt-4 text-[#1B263B]/70">Chargement...</p>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    return role === "pro" ? "Professionnel de santé équine" : "Propriétaire d'équidés";
  };

  const getRoleDescription = (role: string) => {
    return role === "pro" 
      ? "Vous pouvez maintenant développer votre clientèle et gérer votre planning professionnel."
      : "Vous pouvez maintenant rechercher des professionnels et gérer vos équidés.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F2] to-[#F0F0F0]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-[#F86F4D] to-[#FF8A65] flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1B263B] mb-4">
            Compte créé avec succès !
          </h1>
          <p className="text-lg text-[#1B263B]/70">
            Bienvenue dans la communauté Ekicare
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1B263B] mb-4">
              Votre compte a été créé
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[#1B263B]">
                  <strong>{userInfo.name}</strong>
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[#1B263B]">{userInfo.email}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#1B263B]">{getRoleLabel(userInfo.role)}</span>
              </div>
            </div>

            <div className="bg-[#F86F4D]/5 border border-[#F86F4D]/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#1B263B]/80">
                {getRoleDescription(userInfo.role)}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full rounded-lg bg-[#F86F4D] px-6 py-3 text-white font-medium hover:bg-[#F86F4D]/90 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Se connecter à mon compte
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full rounded-lg border border-[#1B263B]/20 px-6 py-3 text-[#1B263B] font-medium hover:bg-[#1B263B]/5 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-[#1B263B]/60">
            Un email de confirmation a été envoyé à <strong>{userInfo.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}