"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [envStatus, setEnvStatus] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test des variables d'environnement côté client
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/test-env');
        const data = await response.json();
        setEnvStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    };

    checkEnv();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6F2] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1B263B] mb-8">
          🔧 Test de Diagnostic
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Variables d'environnement :</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(envStatus, null, 2)}
          </pre>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p><strong>Instructions :</strong></p>
          <ul className="list-disc list-inside mt-2">
            <li>Si tu vois cette page, l'application se charge correctement</li>
            <li>Vérifie les variables d'environnement ci-dessus</li>
            <li>Si toutes les variables sont "true", le problème vient d'ailleurs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
