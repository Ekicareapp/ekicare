import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const useSessionSafe = () => {
  const [isClient, setIsClient] = useState(false);

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

  return {
    data: session,
    status: isClient ? status : "loading",
  };
};
