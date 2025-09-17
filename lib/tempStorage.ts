// Stockage temporaire en mémoire pour les demandes
// Ceci sera perdu au redémarrage du serveur

interface TempDemande {
  id: string;
  proprio_id: string;
  equide_id: string;
  pro_id: string;
  type: string;
  statut: string;
  date: string;
  adresse: string;
  description: string;
  creneaux_alternatifs: any[];
  created_at: string;
  pro?: any;
  equide?: any;
}

// Stockage global en mémoire
let tempDemandes: TempDemande[] = [];

export const tempStorage = {
  // Ajouter une demande
  addDemande: (demande: TempDemande) => {
    tempDemandes.push(demande);
    console.log(`📝 Demande ajoutée au stockage temporaire: ${demande.id}`);
    console.log(`📊 Total demandes: ${tempDemandes.length}`);
    return demande;
  },

  // Récupérer les demandes par propriétaire
  getDemandesByProprio: (proprioId: string) => {
    return tempDemandes.filter(d => d.proprio_id === proprioId);
  },

  // Récupérer les demandes par professionnel
  getDemandesByPro: (proId: string) => {
    return tempDemandes.filter(d => d.pro_id === proId);
  },

  // Récupérer toutes les demandes
  getAllDemandes: () => {
    return tempDemandes;
  },

  // Mettre à jour le statut d'une demande
  updateDemandeStatut: (id: string, statut: string) => {
    const index = tempDemandes.findIndex(d => d.id === id);
    if (index !== -1) {
      tempDemandes[index].statut = statut;
      console.log(`📝 Statut de la demande ${id} mis à jour: ${statut}`);
      return tempDemandes[index];
    }
    return null;
  },

  // Supprimer une demande
  deleteDemande: (id: string) => {
    const index = tempDemandes.findIndex(d => d.id === id);
    if (index !== -1) {
      tempDemandes.splice(index, 1);
      console.log(`🗑️ Demande ${id} supprimée`);
      return true;
    }
    return false;
  },

  // Vider le stockage
  clear: () => {
    tempDemandes = [];
    console.log("🧹 Stockage temporaire vidé");
  }
};
