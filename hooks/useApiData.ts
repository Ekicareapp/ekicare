import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/app/components/ui/Notification';

// Types pour les données
export interface RendezVous {
  id: string;
  demandeId: string;
  proId: string;
  clientId: string;
  date: string;
  heure: string;
  statut: 'en_attente' | 'confirmé' | 'proposition_en_cours' | 'annulé' | 'terminé';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
  };
  equide?: {
    id: string;
    nom: string;
    age: number;
    race: string;
  };
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  ville?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Demande {
  id: string;
  statut: 'pending' | 'accepted' | 'rejected';
  start_at: string;
  pro: {
    id: string;
    nom: string;
    metier: string;
    ville: string;
    telephone: string;
  };
  cheval: {
    id: string;
    nom: string;
    age: number;
    race: string;
  };
}

export interface ProStats {
  rendezVousAujourdhui: number;
  rendezVousCetteSemaine: number;
  clientsActifs: number;
  revenusMois?: number;
  satisfaction?: number;
}

// Hook pour les rendez-vous
export function useRendezVous() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { showError, showSuccess } = useNotifications();

  const fetchRendezVous = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rendez-vous?role=pro');
      if (!response.ok) {
        // Si l'API retourne une erreur, on initialise avec un tableau vide
        console.warn('API rendez-vous non disponible, initialisation avec tableau vide');
        setRendezVous([]);
        return;
      }
      
      const data = await response.json();
      setRendezVous(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      // En cas d'erreur, on initialise avec un tableau vide au lieu de montrer l'erreur
      setRendezVous([]);
    } finally {
      setLoading(false);
    }
  };

  const createRendezVous = async (rendezVousData: Partial<RendezVous>) => {
    try {
      const response = await fetch('/api/rendez-vous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rendezVousData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous');
      }

      await fetchRendezVous();
      const result = await response.json();
      showSuccess('Rendez-vous créé', 'Le rendez-vous a été créé avec succès.');
      return result;
    } catch (err) {
      console.error('Erreur lors de la création du rendez-vous:', err);
      showError('Erreur de création', 'Impossible de créer le rendez-vous. Veuillez réessayer.');
      throw err;
    }
  };

  const updateRendezVous = async (id: string, updates: Partial<RendezVous>) => {
    try {
      const response = await fetch(`/api/rendez-vous/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du rendez-vous');
      }

      await fetchRendezVous();
      const result = await response.json();
      showSuccess('Rendez-vous mis à jour', 'Le rendez-vous a été mis à jour avec succès.');
      return result;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', err);
      showError('Erreur de mise à jour', 'Impossible de mettre à jour le rendez-vous. Veuillez réessayer.');
      throw err;
    }
  };

  useEffect(() => {
    fetchRendezVous();
  }, [session?.user?.id]);

  // Rafraîchir les rendez-vous toutes les 10 secondes - DÉSACTIVÉ
  // useEffect(() => {
  //   const interval = setInterval(fetchRendezVous, 10000);
  //   return () => clearInterval(interval);
  // }, [session?.user?.id]);

  return {
    rendezVous,
    loading,
    error,
    createRendezVous,
    updateRendezVous,
    refetch: fetchRendezVous
  };
}

// Hook pour les clients
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchClients = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/clients');
      if (!response.ok) {
        // Si l'API n'est pas disponible, initialiser avec un tableau vide
        console.warn('API clients non disponible, initialisation avec tableau vide');
        setClients([]);
        return;
      }
      
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des clients:', err);
      // En cas d'erreur, initialiser avec un tableau vide
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Partial<Client>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      await fetchClients();
      return await response.json();
    } catch (err) {
      console.error('Erreur lors de la création du client:', err);
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du client');
      }

      await fetchClients();
      return await response.json();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du client:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [session?.user?.id]);

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    refetch: fetchClients
  };
}

// Hook pour les demandes
export function useDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchDemandes = async () => {
    if (!session?.user?.id) {
      console.log('🔍 useDemandes: Pas de session user ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const role = session.user.role === 'PROFESSIONNEL' ? 'pro' : 'proprio';
      console.log('🔍 useDemandes: Récupération des demandes pour le rôle:', role);
      
      const response = await fetch(`/api/demandes?role=${role}`);
      console.log('🔍 useDemandes: Réponse API:', response.status, response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 useDemandes: Erreur API:', errorText);
        throw new Error('Erreur lors de la récupération des demandes');
      }
      
      const data = await response.json();
      console.log('🔍 useDemandes: Données reçues:', data);
      setDemandes(data);
    } catch (err) {
      console.error('🔍 useDemandes: Erreur lors de la récupération des demandes:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateDemande = async (id: string, statut: 'ACCEPTEE' | 'REFUSEE' | 'REPLANIFIEE' | 'rejected') => {
    try {
      // Pour les propriétaires, utiliser l'API d'annulation
      if (session?.user?.role === 'PROPRIETAIRE' && (statut === 'REFUSEE' || statut === 'rejected')) {
        const response = await fetch('/api/demandes/annuler', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            demandeId: id
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'annulation de la demande');
        }

        await fetchDemandes();
        return await response.json();
      }

      // Pour les professionnels, utiliser l'API de statut
      const response = await fetch('/api/demandes/statut', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          demandeId: id,
          statut: statut
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la demande');
      }

      await fetchDemandes();
      return await response.json();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la demande:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [session?.user?.id, session?.user?.role]);

  // Rafraîchir les demandes toutes les 10 secondes - DÉSACTIVÉ
  // useEffect(() => {
  //   const interval = setInterval(fetchDemandes, 10000);
  //   return () => clearInterval(interval);
  // }, [session?.user?.id, session?.user?.role]);

  return {
    demandes,
    loading,
    error,
    updateDemande,
    refetch: fetchDemandes
  };
}

// Hook pour les statistiques du professionnel
export function useProStats() {
  const [stats, setStats] = useState<ProStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchStats = async () => {
    if (!session?.user?.id || session.user.role !== 'PROFESSIONNEL') return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les rendez-vous pour calculer les stats
      const [rendezVousRes, clientsRes] = await Promise.all([
        fetch('/api/rendez-vous?role=pro'),
        fetch('/api/clients')
      ]);
      
      // Si les APIs ne sont pas disponibles, utiliser des valeurs par défaut
      let rendezVous: RendezVous[] = [];
      let clients: Client[] = [];
      
      if (rendezVousRes.ok) {
        rendezVous = await rendezVousRes.json();
      } else {
        console.warn('API rendez-vous non disponible, utilisation de valeurs par défaut');
      }
      
      if (clientsRes.ok) {
        clients = await clientsRes.json();
      } else {
        console.warn('API clients non disponible, utilisation de valeurs par défaut');
      }
      
      // Calculer les statistiques
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const rendezVousAujourdhui = rendezVous.filter((rdv: RendezVous) => {
        const rdvDate = new Date(rdv.date);
        return rdvDate.toDateString() === today.toDateString();
      }).length;
      
      const rendezVousCetteSemaine = rendezVous.filter((rdv: RendezVous) => {
        const rdvDate = new Date(rdv.date);
        return rdvDate >= startOfWeek && rdvDate <= today;
      }).length;
      
      const clientsActifs = clients.length;
      
      setStats({
        rendezVousAujourdhui,
        rendezVousCetteSemaine,
        clientsActifs,
        revenusMois: 0, // À calculer selon les tarifs
        satisfaction: 4.8 // À récupérer des avis
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      // En cas d'erreur, initialiser avec des valeurs par défaut
      setStats({
        rendezVousAujourdhui: 0,
        rendezVousCetteSemaine: 0,
        clientsActifs: 0,
        revenusMois: 0,
        satisfaction: 4.8
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [session?.user?.id, session?.user?.role]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

// Hook pour les professionnels (recherche)
export function useProfessionnels(searchParams?: {
  ville?: string;
  metier?: string;
  distance?: number;
}) {
  const [professionnels, setProfessionnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionnels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pour l'instant, on retourne des données vides car pas encore d'API pour les professionnels
      // TODO: Créer une API route pour récupérer les professionnels
      const mockProfessionnels: any[] = [];
      
      setProfessionnels(mockProfessionnels);
    } catch (err) {
      console.error('Erreur lors de la récupération des professionnels:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionnels();
  }, [searchParams]);

  return {
    professionnels,
    loading,
    error,
    refetch: fetchProfessionnels
  };
}

// Hook pour les tournées
export function useTournees() {
  const [tournees, setTournees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchTournees = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Pour l'instant, on retourne un tableau vide car pas encore d'API pour les tournées
      // TODO: Créer une API route pour récupérer les tournées
      setTournees([]);
    } catch (err) {
      console.error('Erreur lors de la récupération des tournées:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createTournee = async (tourneeData: any) => {
    try {
      // TODO: Implémenter l'API pour créer une tournée
      console.log('Création de tournée:', tourneeData);
      return tourneeData;
    } catch (err) {
      console.error('Erreur lors de la création de la tournée:', err);
      throw err;
    }
  };

  const updateTournee = async (id: string, updates: any) => {
    try {
      // TODO: Implémenter l'API pour mettre à jour une tournée
      console.log('Mise à jour de tournée:', id, updates);
      return updates;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tournée:', err);
      throw err;
    }
  };

  const deleteTournee = async (id: string) => {
    try {
      // TODO: Implémenter l'API pour supprimer une tournée
      console.log('Suppression de tournée:', id);
    } catch (err) {
      console.error('Erreur lors de la suppression de la tournée:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTournees();
  }, [session?.user?.id]);

  return {
    tournees,
    loading,
    error,
    createTournee,
    updateTournee,
    deleteTournee,
    refetch: fetchTournees
  };
}
