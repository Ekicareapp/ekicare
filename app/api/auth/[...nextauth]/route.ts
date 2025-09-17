import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Vérifier que les variables d'environnement sont présentes
if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ SUPABASE_URL manquante");
}

if (!process.env.SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("❌ SUPABASE_ANON_KEY manquante");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
