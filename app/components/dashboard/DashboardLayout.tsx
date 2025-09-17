"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import MobileMenuButton from "./MobileMenuButton";
import type { NavItem } from "./Sidebar";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
  items: NavItem[];
  title?: string;
}

export default function DashboardLayout({ children, items, title = "Ekicare" }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <Sidebar items={items} title={title} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        items={items} 
        title={title} 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
      
      {/* Main Content */}
      <div className="flex-1 bg-white lg:ml-56">
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#1B263B]/10 bg-white px-4 lg:hidden">
          <Image
            src="/logo-ekicare.png"
            alt="Ekicare Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </div>
        
        {/* Content */}
        <div className="px-4 py-4 sm:px-4 sm:py-6 lg:px-8 bg-white min-h-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
