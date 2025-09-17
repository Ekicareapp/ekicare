import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = (requiredRole?: string) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Vérifier si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Utiliser useSession seulement côté client
  let session, status;
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch (error) {
    // Si NextAuth n'est pas configuré, utiliser des valeurs par défaut
    session = null;
    status = "unauthenticated";
  }

  useEffect(() => {
    if (!isClient) return; // Ne pas exécuter côté serveur
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (requiredRole) {
      const userRole = session.user?.role;
      if (userRole === "PROFESSIONNEL" && requiredRole !== "pro") {
        router.push("/dashboard/dashboard-professionnel");
        return;
      }
      if (userRole === "PROPRIETAIRE" && requiredRole !== "proprio") {
        router.push("/dashboard/proprio");
        return;
      }
    }
  }, [session, status, router, requiredRole, isClient]);

  return {
    user: session?.user,
    isLoading: !isClient || status === "loading",
    isAuthenticated: !!session,
  };
};
