import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface RendezVous {
  id: string;
  demandeId: string;
  proId: string;
  clientId: string;
  date: string;
  statut: 'en_attente' | 'confirmé' | 'proposition_en_cours' | 'annulé' | 'terminé';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  age_equide?: number;
  race_equide?: string;
  date_proposition?: string;
  telephone?: string;
  creneaux_alternatifs?: string[];
  motif_replanification?: string;
  compte_rendu_id?: string;
  etat_general?: string;
  observations?: string;
  procedures?: string;
  medicaments?: string;
  recommandations?: string;
  suivi?: string;
  compte_rendu_created_at?: string;
  compte_rendu_updated_at?: string;
}

export function useRendezVous(proId: string) {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('rendez_vous_with_compte_rendu')
        .select('*')
        .eq('proId', proId)
        .order('date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setRendezVous(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateRendezVous = async (id: string, updates: Partial<RendezVous>) => {
    try {
      const { error: updateError } = await supabase
        .from('rendez_vous')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Rafraîchir les données
      await fetchRendezVous();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', err);
      throw err;
    }
  };

  const updateCompteRendu = async (id: string, compteRendu: {
    etatGeneral: string;
    observations: string;
    procedures: string;
    medicaments: string;
    recommandations: string;
    suivi: string;
  }) => {
    try {
      // Vérifier si un compte-rendu existe déjà
      const { data: existingCompteRendu, error: checkError } = await supabase
        .from('compte_rendus')
        .select('id')
        .eq('rendez_vous_id', id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCompteRendu) {
        // Mettre à jour le compte-rendu existant
        const { error: updateError } = await supabase
          .from('compte_rendus')
          .update({
            etat_general: compteRendu.etatGeneral,
            observations: compteRendu.observations,
            procedures: compteRendu.procedures,
            medicaments: compteRendu.medicaments,
            recommandations: compteRendu.recommandations,
            suivi: compteRendu.suivi,
            updated_at: new Date().toISOString()
          })
          .eq('rendez_vous_id', id);

        if (updateError) throw updateError;
      } else {
        // Créer un nouveau compte-rendu
        const { error: insertError } = await supabase
          .from('compte_rendus')
          .insert({
            rendez_vous_id: id,
            etat_general: compteRendu.etatGeneral,
            observations: compteRendu.observations,
            procedures: compteRendu.procedures,
            medicaments: compteRendu.medicaments,
            recommandations: compteRendu.recommandations,
            suivi: compteRendu.suivi
          });

        if (insertError) throw insertError;
      }

      // Rafraîchir les données
      await fetchRendezVous();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du compte-rendu:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRendezVous();
  }, [proId]);

  return {
    rendezVous,
    loading,
    error,
    updateRendezVous,
    updateCompteRendu,
    refetch: fetchRendezVous
  };
}



