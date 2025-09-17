"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation rapide
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        rememberMe: rememberMe,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      // Récupérer la session pour obtenir le rôle
      const session = await getSession();
      if (session?.user?.role) {
        if (session.user.role === "PROFESSIONNEL") {
          router.push("/dashboard/dashboard-professionnel");
        } else if (session.user.role === "PROPRIETAIRE") {
          router.push("/dashboard/proprio");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail.trim()) {
      setForgotMessage("❌ Veuillez entrer votre adresse email");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      if (response.ok) {
        const data = await response.json();
        setForgotMessage(data.message);
        setForgotEmail("");
      } else {
        const error = await response.json();
        setForgotMessage("❌ " + error.message);
      }
    } catch (error) {
      setForgotMessage("❌ Erreur lors de l'envoi de l'email");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex justify-center pt-12 pb-8 sm:pt-16 sm:pb-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#1B263B]/10 p-4 sm:p-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D] flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#1B263B]">
              Connexion
            </h2>
            <p className="mt-2 text-sm text-[#1B263B]/70">
              Connectez-vous à votre compte Ekicare
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1B263B]">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-[#1B263B]/20 rounded-md shadow-sm placeholder-[#1B263B]/50 focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D] text-[#1B263B]"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1B263B]">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-[#1B263B]/20 rounded-md shadow-sm placeholder-[#1B263B]/50 focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D] text-[#1B263B]"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#F86F4D] focus:ring-[#F86F4D] border-[#1B263B]/20 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#1B263B]">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F86F4D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>

            {/* Links */}
            <div className="text-center space-y-3">
              <div>
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#F86F4D] hover:text-[#F86F4D]/80 transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div>
                <p className="text-sm text-[#1B263B]/70">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/onboarding"
                    className="font-medium text-[#F86F4D] hover:text-[#F86F4D]/80 transition-colors"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Mot de passe oublié */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop avec effet flou et obscurcissement */}
            <motion.div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setShowForgotPassword(false);
                setForgotMessage("");
                setForgotEmail("");
              }}
            />
            
            {/* Modal */}
            <motion.div 
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3 
              }}
            >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#F86F4D]/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#1B263B]">Mot de passe oublié</h2>
              </div>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotMessage("");
                  setForgotEmail("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>

            <motion.p 
              className="text-sm text-[#1B263B]/70 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </motion.p>

            <motion.form 
              onSubmit={handleForgotPassword} 
              className="space-y-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-[#1B263B] mb-2">
                  Adresse email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    // Effacer le message d'erreur quand l'utilisateur commence à taper
                    if (forgotMessage && forgotMessage.includes('❌')) {
                      setForgotMessage("");
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg shadow-sm placeholder-[#1B263B]/50 focus:outline-none focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] text-[#1B263B] transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {forgotMessage && (
                <motion.div 
                  className={`p-4 rounded-lg text-sm border ${
                    forgotMessage.includes('✅') 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {forgotMessage}
                </motion.div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotMessage("");
                    setForgotEmail("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-6 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F86F4D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {forgotLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </div>
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </div>
            </motion.form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
