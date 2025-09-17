"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Composant Menu Burger Animé
function AnimatedBurgerMenu({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-2 text-[#1B263B] hover:bg-[#1B263B]/5"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Barre du haut */}
        <motion.div
          className="absolute w-6 h-0.5 bg-current"
          animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        {/* Barre du milieu */}
        <motion.div
          className="absolute w-6 h-0.5 bg-current"
          animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        {/* Barre du bas */}
        <motion.div
          className="absolute w-6 h-0.5 bg-current"
          animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Accueil" },
    { href: "/demo", label: "Demander une démo" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Menu à gauche */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo-ekicare.png"
                alt="Ekicare Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>

            {/* Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={item.className || "text-sm font-medium text-[#1B263B] hover:text-[#F86F4D] transition-colors"}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Boutons à droite */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/auth/login"
              className="rounded-lg border border-[#1B263B] px-4 py-2 text-sm font-medium text-[#1B263B] hover:bg-[#1B263B]/5 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg bg-[#F86F4D] px-4 py-2 text-sm font-medium text-white hover:bg-[#F86F4D]/90 transition-colors"
            >
              Créer un compte
            </Link>
          </div>

          {/* Menu Burger Mobile */}
          <div className="md:hidden">
            <AnimatedBurgerMenu 
              isOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={item.className || "block px-3 py-2 text-base font-medium text-[#1B263B] hover:bg-[#1B263B]/5 rounded-md"}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="mt-4 space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link
                    href="/auth/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-[#1B263B] hover:bg-[#1B263B]/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/onboarding"
                    className="block rounded-md bg-[#F86F4D] px-3 py-2 text-base font-medium text-white hover:bg-[#F86F4D]/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Créer un compte
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}