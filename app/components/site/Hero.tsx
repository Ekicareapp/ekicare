"use client";

import Logo from "../ui/Logo";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleButtonClick = () => {
    if (session?.user) {
      // Utilisateur connecté - rediriger vers le dashboard approprié
      if (session.user.role === "PROFESSIONNEL") {
        router.push("/dashboard/dashboard-professionnel");
      } else if (session.user.role === "PROPRIETAIRE") {
        router.push("/dashboard/proprio");
      } else {
        router.push("/dashboard");
      }
    } else {
      // Utilisateur non connecté - rediriger vers l'onboarding
      router.push("/onboarding");
    }
  };

  return (
    <section className="bg-white pt-12 pb-6 sm:pt-16 sm:pb-8 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div 
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#1B263B]/10 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-[#1B263B] hover:bg-[#1B263B]/5 transition-colors"
              aria-label="Nouvelle annonce - Lancement d'Ekicare"
            >
              <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F86F4D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-[#F86F4D]"></span>
              </span>
              <span className="text-xs">New — Lancement d'Ekicare</span>
              <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Titre H1 */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-semibold text-[#1B263B] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Les Soins Équins{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-[#F86F4D] rounded-sm transform -rotate-1"></span>
              <span className="relative text-white">Simplifiés</span>
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p 
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#1B263B]/70 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Connectez-vous instantanément avec les meilleurs professionnels de santé équine. 
            Gérez les soins de vos équidés en toute simplicité.
          </motion.p>

          {/* CTA Group */}
          <motion.div 
            className="mt-4 sm:mt-6 flex justify-center px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handleButtonClick}
              className="inline-flex items-center justify-center rounded-lg bg-[#F86F4D] px-4 py-2.5 text-sm sm:text-base font-semibold text-white hover:opacity-90 motion-safe:transition hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F86F4D]"
            >
              {session?.user ? "Mon espace" : "Commencer"}
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview - Desktop */}
        <motion.div 
          className="mt-12 rounded-2xl border border-[#1B263B]/10 bg-white shadow-sm overflow-hidden hidden md:block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="h-[500px] flex">
            {/* Sidebar */}
            <div className="w-56 border-r border-[#1B263B]/10 bg-white text-[#1B263B]">
              <div className="p-6">
                <div className="mb-8">
                  <Image
                    src="/logo-ekicare.png"
                    alt="Ekicare Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </div>
                
                <nav className="space-y-2">
                  <div className="px-3 py-2 bg-[#F86F4D]/10 rounded text-sm font-medium text-[#1B263B]">Aperçu</div>
                  <div className="px-3 py-2 text-sm text-[#1B263B]/70 hover:bg-[#1B263B]/5 rounded">Mes Demandes</div>
                  <div className="px-3 py-2 text-sm text-[#1B263B]/70 hover:bg-[#1B263B]/5 rounded">Mes Équidés</div>
                  <div className="px-3 py-2 text-sm text-[#1B263B]/70 hover:bg-[#1B263B]/5 rounded">Mon Compte</div>
                </nav>
                
                <div className="mt-auto pt-8">
                  <div className="flex items-center gap-2 text-sm text-[#1B263B]/60 hover:text-[#1B263B] cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour au site
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1B263B]">Aperçu</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demandes en cours */}
                <div className="bg-white rounded-lg p-6 border border-[#1B263B]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1B263B]">Demandes en cours (2)</h3>
                  </div>
                  <p className="text-sm text-[#1B263B]/70 mb-4">Vos demandes de soins en attente de réponse</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#FAF6F2] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-[#1B263B]">15/01/2024 11:00:00</div>
                          <div className="text-xs text-[#1B263B]/60">Dr. Martin (vétérinaire) • Paris • Bella</div>
                        </div>
                      </div>
                      <span className="text-red-500 text-sm font-medium">Annuler</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#FAF6F2] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-[#1B263B]">20/01/2024 10:00:00</div>
                          <div className="text-xs text-[#1B263B]/60">Pierre Dubois (maréchal) • Marseille • Bella</div>
                        </div>
                      </div>
                      <span className="text-red-500 text-sm font-medium">Annuler</span>
                    </div>
                  </div>
                </div>

                {/* Rendez-vous à venir */}
                <div className="bg-white rounded-lg p-6 border border-[#1B263B]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1B263B]">Rendez-vous à venir (2)</h3>
                  </div>
                  <p className="text-sm text-[#1B263B]/70 mb-4">Vos prochains rendez-vous confirmés</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#FAF6F2] rounded-lg">
                      <div>
                        <div className="font-medium text-[#1B263B]">Sophie Lemaire (ostéopathe)</div>
                        <div className="text-sm text-[#1B263B]/60">Cheval: Thunder • Heure: 11:00 • Ville: Lyon</div>
                      </div>
                      <div className="text-sm font-medium text-[#F86F4D]">25/01/2024</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#FAF6F2] rounded-lg">
                      <div>
                        <div className="font-medium text-[#1B263B]">Dr. Martin (vétérinaire)</div>
                        <div className="text-sm text-[#1B263B]/60">Cheval: Bella • Heure: 16:00 • Ville: Paris</div>
                      </div>
                      <div className="text-sm font-medium text-[#F86F4D]">28/01/2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mes chevaux */}
              <div className="mt-6 bg-white rounded-lg p-6 border border-[#1B263B]/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1B263B]">Mes chevaux (3)</h3>
                </div>
                <p className="text-sm text-[#1B263B]/70 mb-4">Vos équidés enregistrés</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF6F2] rounded-lg">
                    <div className="font-medium text-[#1B263B] mb-1">Bella</div>
                    <div className="text-sm text-[#1B263B]/60">Race: Selle Français</div>
                    <div className="text-sm text-[#1B263B]/60">Couleur: Bai</div>
                    <div className="text-sm text-[#1B263B]/60 text-right mt-2">8 ans</div>
                  </div>
                  <div className="p-4 bg-[#FAF6F2] rounded-lg">
                    <div className="font-medium text-[#1B263B] mb-1">Thunder</div>
                    <div className="text-sm text-[#1B263B]/60">Race: Pur-sang</div>
                    <div className="text-sm text-[#1B263B]/60">Couleur: Noir</div>
                    <div className="text-sm text-[#1B263B]/60 text-right mt-2">12 ans</div>
                  </div>
                  <div className="p-4 bg-[#FAF6F2] rounded-lg">
                    <div className="font-medium text-[#1B263B] mb-1">Luna</div>
                    <div className="text-sm text-[#1B263B]/60">Race: Arabe</div>
                    <div className="text-sm text-[#1B263B]/60">Couleur: Gris</div>
                    <div className="text-sm text-[#1B263B]/60 text-right mt-2">6 ans</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Preview - Mobile */}
        <div className="mt-12 rounded-2xl border border-[#1B263B]/10 bg-white shadow-sm overflow-hidden md:hidden">
          <div className="h-[600px] bg-white">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1B263B]/10">
              <Image
                src="/logo-ekicare.png"
                alt="Ekicare Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <button className="p-2">
                <svg className="w-5 h-5 text-[#1B263B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Content */}
            <div className="p-4 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B263B]">Aperçu</h1>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4">
                {/* Demandes en cours - Mobile */}
                <div className="bg-[#FAF6F2] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1B263B] mb-2">Demandes en cours (2)</h3>
                  <p className="text-xs text-[#1B263B]/60 mb-3">Vos demandes de soins en attente de réponse</p>
                  
                  <div className="space-y-2">
                    <div className="bg-white rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                          <span className="text-xs text-[#1B263B]">15/01/2024</span>
                        </div>
                        <span className="text-red-500 text-xs">Annuler</span>
                      </div>
                      <div className="text-xs text-[#1B263B]/60 mt-1">Dr. Martin • Paris • Bella</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                          <span className="text-xs text-[#1B263B]">20/01/2024</span>
                        </div>
                        <span className="text-red-500 text-xs">Annuler</span>
                      </div>
                      <div className="text-xs text-[#1B263B]/60 mt-1">Pierre Dubois • Marseille • Bella</div>
                    </div>
                  </div>
                </div>

                {/* Rendez-vous à venir - Mobile */}
                <div className="bg-[#FAF6F2] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1B263B] mb-2">Rendez-vous à venir (2)</h3>
                  <p className="text-xs text-[#1B263B]/60 mb-3">Vos prochains rendez-vous confirmés</p>
                  
                  <div className="space-y-2">
                    <div className="bg-white rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-[#1B263B]">Sophie Lemaire</div>
                          <div className="text-xs text-[#1B263B]/60">Thunder • 11:00 • Lyon</div>
                        </div>
                        <div className="text-xs font-medium text-[#F86F4D]">25/01</div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-[#1B263B]">Dr. Martin</div>
                          <div className="text-xs text-[#1B263B]/60">Bella • 16:00 • Paris</div>
                        </div>
                        <div className="text-xs font-medium text-[#F86F4D]">28/01</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mes chevaux - Mobile */}
                <div className="bg-[#FAF6F2] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1B263B] mb-2">Mes chevaux (3)</h3>
                  <p className="text-xs text-[#1B263B]/60 mb-3">Vos équidés enregistrés</p>
                  
                  <div className="space-y-2">
                    <div className="bg-white rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-medium text-[#1B263B]">Bella</div>
                          <div className="text-xs text-[#1B263B]/60">Selle Français • Bai</div>
                        </div>
                        <div className="text-xs text-[#1B263B]/60">8 ans</div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-medium text-[#1B263B]">Thunder</div>
                          <div className="text-xs text-[#1B263B]/60">Pur-sang • Noir</div>
                        </div>
                        <div className="text-xs text-[#1B263B]/60">12 ans</div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-medium text-[#1B263B]">Luna</div>
                          <div className="text-xs text-[#1B263B]/60">Arabe • Gris</div>
                        </div>
                        <div className="text-xs text-[#1B263B]/60">6 ans</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}