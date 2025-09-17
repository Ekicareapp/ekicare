import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = (requiredRole?: string) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
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
  }, [session, status, router, requiredRole]);

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  };
};
