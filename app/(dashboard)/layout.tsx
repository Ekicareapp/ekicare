import DashboardTopbar from "../components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <DashboardTopbar />
      <main className="flex-1 bg-white text-[#1B263B]">{children}</main>
    </div>
  );
}
