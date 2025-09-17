import { useState, useEffect } from 'react';

interface Equide {
  id: string;
  nom: string;
  age: number;
  race: string;
  sexe: string;
  created_at: string;
  updated_at: string;
}

export function useEquides() {
  const [equides, setEquides] = useState<Equide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquides = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/proprio/equides');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des équidés');
      }

      const data = await response.json();
      setEquides(data.equides || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des équidés:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquides();
  }, []);

  return {
    equides,
    loading,
    error,
    refetch: fetchEquides
  };
}

