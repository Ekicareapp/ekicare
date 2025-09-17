import { useState, useEffect, useMemo } from 'react';

interface Disponibilites {
  lundi: { matin: boolean; apresMidi: boolean; soir: boolean };
  mardi: { matin: boolean; apresMidi: boolean; soir: boolean };
  mercredi: { matin: boolean; apresMidi: boolean; soir: boolean };
  jeudi: { matin: boolean; apresMidi: boolean; soir: boolean };
  vendredi: { matin: boolean; apresMidi: boolean; soir: boolean };
  samedi: { matin: boolean; apresMidi: boolean; soir: boolean };
  dimanche: { matin: boolean; apresMidi: boolean; soir: boolean };
}

interface Creneau {
  heure: string;
  label: string;
  disponible: boolean;
}

export function useDisponibilites(proId: string | null) {
  const [disponibilites, setDisponibilites] = useState<Disponibilites | null>(null);
  const [dureeConsultation, setDureeConsultation] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les disponibilités du professionnel
  useEffect(() => {
    if (!proId) return;

    const fetchDisponibilites = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/professionnels/${proId}/disponibilites`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }

        const data = await response.json();
        setDisponibilites(data.disponibilites);
        setDureeConsultation(data.dureeConsultation);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [proId]);

  // Générer les créneaux disponibles pour un jour donné
  const genererCreneaux = useMemo(() => {
    return (jour: string, date: string): Creneau[] => {
      if (!disponibilites) return [];

      const jourKey = jour.toLowerCase() as keyof Disponibilites;
      const jourDisponibilites = disponibilites[jourKey];

      if (!jourDisponibilites) return [];

      const creneaux: Creneau[] = [];

      // Créneaux du matin (8h-12h)
      if (jourDisponibilites.matin) {
        for (let heure = 8; heure < 12; heure += dureeConsultation / 60) {
          const heureEntiere = Math.floor(heure);
          const minutes = Math.round((heure % 1) * 60);
          const heureStr = `${heureEntiere.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          creneaux.push({
            heure: heureStr,
            label: heureStr,
            disponible: true
          });
        }
      }

      // Créneaux de l'après-midi (14h-18h)
      if (jourDisponibilites.apresMidi) {
        for (let heure = 14; heure < 18; heure += dureeConsultation / 60) {
          const heureEntiere = Math.floor(heure);
          const minutes = Math.round((heure % 1) * 60);
          const heureStr = `${heureEntiere.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          creneaux.push({
            heure: heureStr,
            label: heureStr,
            disponible: true
          });
        }
      }

      // Créneaux du soir (18h-20h)
      if (jourDisponibilites.soir) {
        for (let heure = 18; heure < 20; heure += dureeConsultation / 60) {
          const heureEntiere = Math.floor(heure);
          const minutes = Math.round((heure % 1) * 60);
          const heureStr = `${heureEntiere.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          creneaux.push({
            heure: heureStr,
            label: heureStr,
            disponible: true
          });
        }
      }

      return creneaux;
    };
  }, [disponibilites, dureeConsultation]);

  // Vérifier si un jour est disponible
  const isJourDisponible = useMemo(() => {
    return (jour: string): boolean => {
      if (!disponibilites) return false;

      const jourKey = jour.toLowerCase() as keyof Disponibilites;
      const jourDisponibilites = disponibilites[jourKey];

      return jourDisponibilites ? 
        (jourDisponibilites.matin || jourDisponibilites.apresMidi || jourDisponibilites.soir) : 
        false;
    };
  }, [disponibilites]);

  // Obtenir le nom du jour en français
  const getNomJour = (jour: string): string => {
    const jours: { [key: string]: string } = {
      'lundi': 'Lundi',
      'mardi': 'Mardi', 
      'mercredi': 'Mercredi',
      'jeudi': 'Jeudi',
      'vendredi': 'Vendredi',
      'samedi': 'Samedi',
      'dimanche': 'Dimanche'
    };
    return jours[jour.toLowerCase()] || jour;
  };

  // Obtenir le jour de la semaine à partir d'une date
  const getJourFromDate = (date: string): string => {
    const dateObj = new Date(date);
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return jours[dateObj.getDay()];
  };

  return {
    disponibilites,
    dureeConsultation,
    loading,
    error,
    genererCreneaux,
    isJourDisponible,
    getNomJour,
    getJourFromDate
  };
}
