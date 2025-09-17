"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HomeIcon, InboxIcon, CalendarIcon, UserIcon, HorseIcon } from "./Sidebar";
import StreakBadge from "./StreakBadge";

export type NavItem = { href: string; label: string; icon: React.ReactNode };

interface MobileSidebarProps {
  items: NavItem[];
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ items, title = "Ekicare", isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="fixed inset-0 z-40 backdrop-blur-md bg-black/30 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Sidebar */}
          <motion.aside 
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#1B263B]/10 bg-white text-[#1B263B] lg:hidden flex flex-col h-full"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4">
          <Image
            src="/logo-ekicare.png"
            alt="Ekicare Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#1B263B]/70 hover:bg-[#F86F4D]/5 hover:text-[#F86F4D]"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="px-2 py-2">
          {items.map((it, index) => {
            const active = pathname === it.href;
            return (
              <motion.div
                key={it.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              >
                <Link
                  href={it.href}
                  onClick={onClose}
                  className={`mb-1 flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition
                    ${active ? "bg-[#F86F4D]/15 text-[#F86F4D]" : "text-[#1B263B]/80 hover:bg-[#F86F4D]/5 hover:text-[#F86F4D]"}`}
                >
                  <span className="text-[#1B263B]/70">{it.icon}</span>
                  <span>{it.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-[#1B263B]/10 mx-2"></div>

        {/* Retour au site */}
        <motion.div 
          className="px-2 py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Link
            href="/"
            onClick={onClose}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-[#1B263B]/70 hover:bg-[#F86F4D]/5 hover:text-[#F86F4D] transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour au site</span>
          </Link>
        </motion.div>

        {/* Espace flexible pour pousser le badge vers le bas */}
        <div className="flex-1"></div>

        {/* Badge de Gamification - Tout en bas */}
        <motion.div 
          className="px-2 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <StreakBadge />
        </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
