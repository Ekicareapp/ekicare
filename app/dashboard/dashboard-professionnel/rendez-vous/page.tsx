import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import AuthGuard from "../../../components/auth/AuthGuard";
import ProRendezVousProfessionnel from "../../../components/dashboard/ProRendezVousProfessionnel";
import { HomeIcon, InboxIcon, CalendarIcon, UserIcon, ChartBarIcon, MapIcon } from "../../../components/dashboard/Sidebar";

const proNavItems = [
  { href: "/dashboard/dashboard-professionnel", label: "Tableau de bord", icon: <HomeIcon /> },
  { href: "/dashboard/dashboard-professionnel/rendez-vous", label: "Mes rendez-vous", icon: <CalendarIcon /> },
  { href: "/dashboard/dashboard-professionnel/tournees", label: "Mes tournées", icon: <MapIcon /> },
  { href: "/dashboard/dashboard-professionnel/clients", label: "Mes clients", icon: <UserIcon /> },
  { href: "/dashboard/dashboard-professionnel/parametres", label: "Paramètres", icon: <InboxIcon /> },
];

export default function ProRendezVousPage() {
  return (
    <AuthGuard requiredRole="pro">
      <DashboardLayout items={proNavItems} title="Ekicare Pro">
        <ProRendezVousProfessionnel />
      </DashboardLayout>
    </AuthGuard>
  );
}
