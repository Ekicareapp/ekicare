import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Récupérer l'utilisateur depuis Supabase
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (userError || !user) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
            return null;
          }

          // Vérifier le mot de passe
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Récupérer les profils associés
          let proprioProfile = null;
          let proProfile = null;

          if (user.role === 'PROPRIETAIRE') {
            const { data: proprio } = await supabase
              .from('proprio_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            proprioProfile = proprio;
          } else if (user.role === 'PROFESSIONNEL') {
            const { data: pro } = await supabase
              .from('pro_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            proProfile = pro;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            proprioProfile,
            proProfile,
            rememberMe: credentials.rememberMe === "true" || credentials.rememberMe === true
          };
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours par défaut
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.proprioProfile = user.proprioProfile;
        token.proProfile = user.proProfile;
        // Si l'utilisateur a coché "Se souvenir de moi", la session dure 30 jours
        // Sinon, elle dure 24 heures
        token.rememberMe = (user as any).rememberMe || false;
        token.maxAge = token.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.proprioProfile = token.proprioProfile as any;
        session.user.proProfile = token.proProfile as any;
      }
      return session;
    }
  }
};