"use client";

import FAQ from "../components/site/FAQ";
import Hero from "../components/site/Hero";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleMySpaceClick = () => {
    if (session?.user) {
      if (session.user.role === "PROFESSIONNEL") {
        router.push("/dashboard/dashboard-professionnel");
      } else if (session.user.role === "PROPRIETAIRE") {
        router.push("/dashboard/proprio");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Preview */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B263B]">
              Pourquoi choisir Ekicare ?
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-[#1B263B]/70 px-2">
              Une plateforme pensée pour faciliter la relation entre propriétaires et professionnels
            </p>
          </motion.div>
          
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D]/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1B263B]">Rapidité</h3>
                <p className="mt-2 text-[#1B263B]/70">
                  Trouvez et contactez rapidement les professionnels disponibles près de chez vous.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D]/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1B263B]">Qualité</h3>
                <p className="mt-2 text-[#1B263B]/70">
                  Accédez à un réseau de professionnels qualifiés et vérifiés.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D]/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1B263B]">Suivi</h3>
                <p className="mt-2 text-[#1B263B]/70">
                  Gérez facilement l&apos;historique et le suivi des soins de vos équidés.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Fonctionnalités Section */}
      <motion.section 
        id="fonctionnalites" 
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B263B]">
              Fonctionnalités
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-[#1B263B]/70 px-2">
              Découvrez toutes les fonctionnalités qui rendent Ekicare indispensable
            </p>
          </motion.div>

          <div className="mt-12 sm:mt-16 lg:mt-20 space-y-16 sm:space-y-20">
            {/* Fonctionnalité 1 - Recherche de professionnels */}
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="order-2 lg:order-1 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B263B]">Recherche de professionnels</h3>
                  <p className="mt-4 text-lg text-[#1B263B]/70">
                    Trouvez rapidement les vétérinaires, maréchaux-ferrants, ostéopathes et autres professionnels 
                    spécialisés dans les soins équins près de chez vous.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Filtres avancés par spécialité et localisation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Avis et notes des autres propriétaires</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Disponibilités en temps réel</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F86F4D]/10 to-[#1B263B]/5 p-3 sm:p-4 lg:p-6">
                    <div className="flex h-full flex-col">
                      {/* Header avec icône de recherche */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#F86F4D] flex items-center justify-center">
                            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-[#1B263B]">Recherche</span>
                        </div>
                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500"></div>
                      </div>
                      
                      {/* Barre de recherche */}
                      <div className="mb-3 sm:mb-4">
                        <div className="h-7 sm:h-8 md:h-10 bg-white rounded-lg flex items-center px-2 sm:px-3 shadow-sm">
                          <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/40 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-xs sm:text-sm text-[#1B263B]/60 truncate">Vétérinaire équin près de moi</span>
                        </div>
                      </div>
                      
                      {/* Liste des résultats */}
                      <div className="space-y-1 sm:space-y-2 flex-1">
                        <div className="bg-white/80 rounded-lg p-1.5 sm:p-2 md:p-3 shadow-sm">
                          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-[#F86F4D] flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">Dr</span>
                            </div>
                            <span className="text-xs font-semibold text-[#1B263B] truncate">Dr. Martin</span>
                            <div className="flex flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Vétérinaire équin • 2.5 km</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-1.5 sm:p-2 md:p-3 shadow-sm">
                          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-[#1B263B] flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">S</span>
                            </div>
                            <span className="text-xs font-semibold text-[#1B263B] truncate">Sophie L.</span>
                            <div className="flex flex-shrink-0">
                              {[...Array(4)].map((_, i) => (
                                <svg key={i} className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Maréchal-ferrant • 1.8 km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fonctionnalité 2 - Planning et rendez-vous */}
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="order-1">
                <div className="relative">
                  <div className="aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F86F4D]/10 to-[#1B263B]/5 p-3 sm:p-4 lg:p-6">
                    <div className="flex h-full flex-col">
                      {/* Header avec icône calendrier */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#1B263B] flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-[#1B263B]">Planning</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      
                      {/* Calendrier mini */}
                      <div className="mb-4">
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="text-xs font-semibold text-[#1B263B] mb-2">Janvier 2024</div>
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            <div className="text-center text-[#1B263B]/40">L</div>
                            <div className="text-center text-[#1B263B]/40">M</div>
                            <div className="text-center text-[#1B263B]/40">M</div>
                            <div className="text-center text-[#1B263B]/40">J</div>
                            <div className="text-center text-[#1B263B]/40">V</div>
                            <div className="text-center text-[#1B263B]/40">S</div>
                            <div className="text-center text-[#1B263B]/40">D</div>
                            <div className="text-center text-[#1B263B]/40">1</div>
                            <div className="text-center text-[#1B263B]/40">2</div>
                            <div className="text-center text-[#1B263B]/40">3</div>
                            <div className="text-center text-[#1B263B]/40">4</div>
                            <div className="text-center text-[#1B263B]/40">5</div>
                            <div className="text-center text-[#1B263B]/40">6</div>
                            <div className="text-center text-[#1B263B]/40">7</div>
                            <div className="text-center text-[#1B263B]/40">8</div>
                            <div className="text-center text-[#1B263B]/40">9</div>
                            <div className="text-center text-[#1B263B]/40">10</div>
                            <div className="text-center text-[#1B263B]/40">11</div>
                            <div className="text-center text-[#1B263B]/40">12</div>
                            <div className="text-center text-[#1B263B]/40">13</div>
                            <div className="text-center text-[#1B263B]/40">14</div>
                            <div className="text-center text-[#1B263B]/40">15</div>
                            <div className="text-center text-[#1B263B]/40">16</div>
                            <div className="text-center text-[#1B263B]/40">17</div>
                            <div className="text-center text-[#1B263B]/40">18</div>
                            <div className="text-center text-[#1B263B]/40">19</div>
                            <div className="text-center text-[#1B263B]/40">20</div>
                            <div className="text-center text-[#1B263B]/40">21</div>
                            <div className="text-center text-[#1B263B]/40">22</div>
                            <div className="text-center text-[#1B263B]/40">23</div>
                            <div className="text-center text-[#1B263B]/40">24</div>
                            <div className="text-center text-[#1B263B]/40">25</div>
                            <div className="text-center text-[#1B263B]/40">26</div>
                            <div className="text-center text-[#1B263B]/40">27</div>
                            <div className="text-center text-[#1B263B]/40">28</div>
                            <div className="text-center text-[#1B263B]/40">29</div>
                            <div className="text-center text-[#1B263B]/40">30</div>
                            <div className="text-center text-[#1B263B]/40">31</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rendez-vous du jour */}
                      <div className="space-y-1 sm:space-y-2 flex-1">
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-[#F86F4D]"></div>
                            <span className="text-xs font-semibold text-[#1B263B]">10:00</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Dr. Martin - Bella</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-[#1B263B]"></div>
                            <span className="text-xs font-semibold text-[#1B263B]">14:30</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Sophie L. - Thunder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B263B]">Planning et rendez-vous</h3>
                  <p className="mt-4 text-lg text-[#1B263B]/70">
                    Planifiez vos rendez-vous en ligne, consultez les disponibilités et recevez des rappels automatiques.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Réservation en ligne 24h/24</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Synchronisation avec votre calendrier</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Rappels par email et SMS</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Fonctionnalité 3 - Suivi des soins */}
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="order-2 lg:order-1 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B263B]">Suivi des soins</h3>
                  <p className="mt-4 text-lg text-[#1B263B]/70">
                    Conservez l&apos;historique complet des soins de vos équidés et partagez les informations avec vos professionnels.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Historique médical complet</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Partage sécurisé avec les professionnels</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Rappels de soins préventifs</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F86F4D]/10 to-[#1B263B]/5 p-3 sm:p-4 lg:p-6">
                    <div className="flex h-full flex-col">
                      {/* Header avec icône dossier */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#F86F4D] flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-[#1B263B]">Dossier</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      
                      {/* Informations du cheval */}
                      <div className="mb-4">
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 rounded-full bg-[#F86F4D] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">B</span>
                            </div>
                            <span className="text-sm font-semibold text-[#1B263B]">Bella</span>
                            <span className="text-xs text-[#1B263B]/60">• 8 ans</span>
                          </div>
                          <div className="text-xs text-[#1B263B]/60">Selle Français • Bai</div>
                        </div>
                      </div>
                      
                      {/* Historique des soins */}
                      <div className="space-y-1 sm:space-y-2 flex-1">
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#1B263B]">15/01/2024</span>
                            <span className="text-xs text-[#F86F4D]">Vaccin</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Dr. Martin - Tétanos + Grippe</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#1B263B]">10/01/2024</span>
                            <span className="text-xs text-[#1B263B]">Ferrure</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Pierre Dubois - Avant + Arrière</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#1B263B]">05/01/2024</span>
                            <span className="text-xs text-[#1B263B]">Ostéo</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Sophie L. - Contrôle général</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fonctionnalité 4 - Gestion des équidés */}
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="order-1">
                <div className="relative">
                  <div className="aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F86F4D]/10 to-[#1B263B]/5 p-3 sm:p-4 lg:p-6">
                    <div className="flex h-full flex-col">
                      {/* Header avec icône cheval */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#1B263B] flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-[#1B263B]">Équidés</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      
                      {/* Liste des équidés */}
                      <div className="space-y-1 sm:space-y-2 flex-1">
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-full bg-[#F86F4D] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">B</span>
                            </div>
                            <span className="text-xs font-semibold text-[#1B263B]">Bella</span>
                            <span className="text-xs text-[#1B263B]/60">• 8 ans</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Selle Français • Bai</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-full bg-[#1B263B] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">T</span>
                            </div>
                            <span className="text-xs font-semibold text-[#1B263B]">Thunder</span>
                            <span className="text-xs text-[#1B263B]/60">• 12 ans</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Pur-sang • Noir</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-full bg-[#F86F4D] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">L</span>
                            </div>
                            <span className="text-xs font-semibold text-[#1B263B]">Luna</span>
                            <span className="text-xs text-[#1B263B]/60">• 6 ans</span>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">Arabe • Gris</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B263B]">Gestion des équidés</h3>
                  <p className="mt-4 text-lg text-[#1B263B]/70">
                    Enregistrez et gérez facilement tous vos équidés avec leurs informations détaillées et leur historique.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Profils détaillés de vos équidés</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Photos et documents personnalisés</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#1B263B]/80">Suivi des soins par équidé</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section - Professionnels */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1B263B] to-[#1B263B]/90"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Rejoignez Ekicare
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-white/80 px-2">
              Développez votre activité en rejoignant notre réseau de professionnels de santé équine
            </p>
          </motion.div>
          
          {/* Cards Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 - Clients */}
            <motion.div 
              className="rounded-2xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#F86F4D] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Plus de clients</h3>
                <p className="text-white/70 text-sm">
                  Accédez à une base de propriétaires d&apos;équidés qualifiés et engagés
                </p>
              </div>
            </motion.div>

            {/* Card 2 - Gestion */}
            <motion.div 
              className="rounded-2xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#F86F4D] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Gestion simplifiée</h3>
                <p className="text-white/70 text-sm">
                  Planifiez vos rendez-vous et gérez votre planning en toute simplicité
                </p>
              </div>
            </motion.div>

            {/* Card 3 - Croissance */}
            <motion.div 
              className="rounded-2xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#F86F4D] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Développez votre activité</h3>
                <p className="text-white/70 text-sm">
                  Augmentez votre visibilité et développez votre clientèle équine
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="mt-12 sm:mt-16 text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session?.user ? (
                <button
                  onClick={handleMySpaceClick}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1B263B] shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Mon espace
                </button>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1B263B] shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Se connecter
                  </a>
                  <a
                    href="/onboarding?role=pro"
                    className="inline-flex items-center justify-center rounded-lg bg-[#F86F4D] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#F86F4D]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F86F4D]"
                  >
                    S&apos;inscrire en tant que professionnel
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}