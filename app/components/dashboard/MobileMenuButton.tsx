"use client";

import { motion } from "framer-motion";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md p-2 hover:bg-[#F86F4D]/5 lg:hidden transition-colors ${
        isOpen ? "text-white" : "text-[#1B263B]"
      }`}
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
