export type DemandeStatut = "pending" | "accepted" | "rescheduled" | "declined" | "cancelled_by_owner";

export type Demande = {
  id: string;
  pro: { id: string; nom: string; metier: "veterinaire" | "osteopathe" | "marechal"; ville: string };
  proprio: { id: string; nom: string };
  cheval?: { id: string; nom: string };
  start_at: string;
  end_at: string;
  statut: DemandeStatut;
};

export type RendezVous = {
  id: string;
  client: string;
  equide: string;
  adresse: string;
  date: string;
  heure: string;
  type: string;
  motif: string;
  telephone: string;
  statut: string;
  compteRendu?: {
    diagnostic: string;
    traitement: string;
    recommandations: string;
    notes: string;
  };
  motifReplanification?: string;
  raceEquide?: string;
  ageEquide?: string;
  dateProposition?: string;
  creneauxAlternatifs?: Array<{
    date: string;
    heure: string;
  }>;
};


