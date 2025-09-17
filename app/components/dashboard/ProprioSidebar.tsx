"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { href: string; label: string; icon: React.ReactElement };

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#1B263B]">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconHorse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#1B263B]">
      <path d="M5 19c0-4 3-7 7-7 3 0 5 2 7 4l1 1v3h-3l-2-2-3 2H5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconRequests() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#1B263B]">
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconAccount() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#1B263B]">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 20c2-3 5-5 8-5s6 2 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProprioSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items: Item[] = [
    { href: "/dashboard/proprio", label: "Accueil", icon: <IconHome /> },
    { href: "/dashboard/proprio/equides", label: "Mes équidés", icon: <IconHorse /> },
    { href: "/dashboard/proprio/demandes", label: "Mes demandes", icon: <IconRequests /> },
    { href: "/dashboard/proprio/compte", label: "Mon compte", icon: <IconAccount /> },
  ];

  const LinkItem = ({ href, label, icon }: Item) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          active
            ? "bg-[#F86F4D]/10 text-[#F86F4D]"
            : "text-[#1B263B] hover:bg-[#F86F4D]/5"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <span className={active ? "text-[#F86F4D]" : "text-[#1B263B]"}>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-30 border-b border-[#1B263B]/10 bg-[#FAF6F2] p-3 md:hidden">
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
          className="rounded-md border border-[#1B263B]/20 bg-white px-3 py-2 text-sm hover:bg-[#F86F4D]/5 transition-colors"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Barre du haut */}
            <motion.div
              className="absolute w-6 h-0.5 bg-current"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Barre du milieu */}
            <motion.div
              className="absolute w-6 h-0.5 bg-current"
              animate={open ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Barre du bas */}
            <motion.div
              className="absolute w-6 h-0.5 bg-current"
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-40 w-64 border-r border-[#1B263B]/10 bg-white p-4 md:static md:translate-x-0"
        initial={{ x: -256 }}
        animate={{ x: open ? 0 : -256 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        aria-label="Barre latérale"
      >
        <div className="mb-4 hidden md:block text-lg font-semibold text-[#1B263B]">Ekicare</div>
        <nav className="space-y-1">
          {items.map((it, index) => (
            <motion.div
              key={it.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            >
              <LinkItem {...it} />
            </motion.div>
          ))}
        </nav>
        {/* Close overlay button on mobile */}
        <motion.div 
          className="mt-4 md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <button className="text-sm text-[#1B263B] hover:text-[#F86F4D] transition-colors" onClick={() => setOpen(false)}>Fermer</button>
        </motion.div>
      </motion.aside>
      
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed inset-0 z-30 backdrop-blur-md bg-black/30 md:hidden" 
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}


