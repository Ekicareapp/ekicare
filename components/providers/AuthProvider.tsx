"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AuthProviderProps {
  children: ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F2]">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-[#1B263B] mb-4">
          Erreur de chargement
        </h2>
        <p className="text-gray-600 mb-4">
          Une erreur s'est produite lors du chargement de l'application.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Recharger la page
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">
            Détails de l'erreur
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ErrorBoundary>
  );
}
