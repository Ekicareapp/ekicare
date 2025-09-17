import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AuthGuard from "../../components/auth/AuthGuard";
import { HomeIcon, InboxIcon, CalendarIcon, UserIcon, HorseIcon, SearchIcon } from "../../components/dashboard/Sidebar";

const proprioNavItems = [
  { href: "/dashboard/proprio", label: "Tableau de bord", icon: <HomeIcon /> },
  { href: "/dashboard/proprio/rechercher", label: "Rechercher un pro", icon: <SearchIcon /> },
  { href: "/dashboard/proprio/demandes", label: "Mes rendez-vous", icon: <CalendarIcon /> },
  { href: "/dashboard/proprio/equides", label: "Mes Équidés", icon: <HorseIcon /> },
  { href: "/dashboard/proprio/compte", label: "Mon profil", icon: <UserIcon /> },
];

export default function ProprioDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="proprio">
      <DashboardLayout items={proprioNavItems} title="Ekicare Proprio">
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
