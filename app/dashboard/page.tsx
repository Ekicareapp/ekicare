"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Rediriger vers le dashboard approprié selon le rôle
    if (session.user?.role === "PROFESSIONNEL") {
      router.push("/dashboard/dashboard-professionnel");
    } else if (session.user?.role === "PROPRIETAIRE") {
      router.push("/dashboard/proprio");
    } else {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D] flex items-center justify-center mb-4">
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-[#1B263B]/70">Redirection en cours...</p>
      </div>
    </div>
  );
}
