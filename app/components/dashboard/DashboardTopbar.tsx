"use client";
import { ReactNode } from "react";

interface DashboardTopbarProps {
  title?: string;
  right?: ReactNode;
}

export default function DashboardTopbar({ title = "Aperçu", right }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1B263B]/10 bg-white/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Titre */}
        <h1 className="text-lg font-semibold text-[#1B263B]">{title}</h1>
        
        {/* Slot pour boutons à droite */}
        {right && (
          <div className="flex items-center space-x-3">
            {right}
          </div>
        )}
      </div>
    </header>
  );
}
