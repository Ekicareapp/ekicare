"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token de réinitialisation invalide");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (error) {
      setError("Erreur lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF6F2] flex justify-center pt-12 pb-8 sm:pt-16 sm:pb-12 px-3 sm:px-4 lg:px-8">
        <div className="max-w-md w-full space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#1B263B]/10 p-4 sm:p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1B263B] mb-2">
              Mot de passe réinitialisé !
            </h2>
            <p className="text-sm text-[#1B263B]/70 mb-4">
              Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full rounded-lg bg-[#F86F4D] px-6 py-3 text-white font-medium hover:bg-[#F86F4D]/90 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex justify-center pt-12 pb-8 sm:pt-16 sm:pb-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#1B263B]/10 p-4 sm:p-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D] flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#1B263B]">
              Nouveau mot de passe
            </h2>
            <p className="mt-2 text-sm text-[#1B263B]/70">
              Entrez votre nouveau mot de passe
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
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1B263B]">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-[#1B263B]/20 rounded-md shadow-sm placeholder-[#1B263B]/50 focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D] text-[#1B263B]"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-[#1B263B]/60">Minimum 8 caractères</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1B263B]">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-[#1B263B]/20 rounded-md shadow-sm placeholder-[#1B263B]/50 focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D] text-[#1B263B]"
                  placeholder="••••••••"
                />
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
                    Réinitialisation...
                  </div>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </button>
            </div>

            {/* Link to Login */}
            <div className="text-center">
              <p className="text-sm text-[#1B263B]/70">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#F86F4D] hover:text-[#F86F4D]/80 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


