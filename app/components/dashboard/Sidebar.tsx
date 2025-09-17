"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import StreakBadge from "./StreakBadge";

export function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 10.5 12 3l9 7.5M5 9v11h14V9" />
    </svg>
  );
}
export function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 7.5 6.5 3h11L21 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z" />
      <path d="M3 14h4c1 2 3 3 5 3s4-1 5-3h4" />
    </svg>
  );
}
export function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 9h18M7 3v4M17 3v4M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
export function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4 20c1.5-3.5 4.5-5.5 8-5.5S18.5 16.5 20 20" />
    </svg>
  );
}
export function HorseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 12c2-3 6-5 9-5l5 2 2 3" />
      <path d="M8 18h5m-9-3c2 0 3 1 4 3M18 12l-3 2-2-2" />
      <circle cx="17" cy="9.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
export function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
export function ChartBarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
export function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 6l6-3 6 3 6-3v12l-6 3-6-3-6 3z" />
      <path d="M9 3v12" />
      <path d="M15 3v12" />
    </svg>
  );
}

export type NavItem = { href: string; label: string; icon: React.ReactNode };

export default function Sidebar({ items, title = "Ekicare" }: { items: NavItem[]; title?: string }) {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-56 border-r border-[#1B263B]/10 bg-white text-[#1B263B] hidden lg:block flex flex-col h-full">
      {/* Header */}
      <div className="flex h-14 items-center px-4">
        <Image
          src="/logo-ekicare.png"
          alt="Ekicare Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>

      {/* Links */}
      <nav className="px-2 py-2 flex-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`mb-1 flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition
                ${active ? "bg-[#F86F4D]/15 text-[#F86F4D]" : "text-[#1B263B]/80 hover:bg-[#F86F4D]/5 hover:text-[#F86F4D]"}`}
            >
              <span className="text-[#1B263B]/70">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-[#1B263B]/10 mx-2"></div>

      {/* Retour au site */}
      <div className="px-2 py-2">
        <Link
          href="/"
          className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-[#1B263B]/70 hover:bg-[#F86F4D]/5 hover:text-[#F86F4D] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Retour au site</span>
        </Link>
      </div>

      {/* Badge de Gamification - Tout en bas */}
      <div className="px-2 pb-4">
        <StreakBadge />
      </div>
    </aside>
  );
}