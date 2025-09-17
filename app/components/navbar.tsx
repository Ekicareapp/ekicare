"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard/proprio", label: "Mon espace" },
  { href: "/onboarding", label: "Créer un compte" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1B263B]/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#F86F4D]" />
          <span className="text-lg font-semibold text-[#1B263B]">Ekicare</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm font-medium transition ${
                    active ? "text-[#F86F4D]" : "text-[#1B263B]/80 hover:text-[#1B263B]"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/onboarding"
              className="rounded-xl bg-[#F86F4D] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Commencer
            </Link>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md p-2 text-[#1B263B] hover:bg-[#1B263B]/5"
          aria-label="Ouvrir le menu"
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
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div 
            className="md:hidden border-t border-[#1B263B]/10 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.ul 
              className="mx-auto max-w-6xl px-4 py-3 space-y-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {links.map((l, index) => (
                <motion.li 
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-2 py-2 text-sm font-medium ${
                      pathname.startsWith(l.href)
                        ? "text-[#F86F4D] bg-[#F86F4D]/10"
                        : "text-[#1B263B]/80 hover:bg-[#1B263B]/5 hover:text-[#1B263B]"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Link
                  href="/onboarding"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-[#F86F4D] px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Commencer
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
