"use client";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import VueMensuelleCompacte from "./VueMensuelleCompacte";
import { useRendezVous, useProStats, useClients, useDemandes } from "@/hooks/useApiData";
import { useSessionSafe } from "@/hooks/useSessionSafe";
import { useState, useEffect } from "react";
import CleanDataButton from "@/app/components/ui/CleanDataButton";
import CreateTablesButton from "@/app/components/ui/CreateTablesButton";

export default function ProDashboardReal() {
  const { data: session } = useSessionSafe();
  const { rendezVous, loading: rendezVousLoading } = useRendezVous();
  const { stats, loading: statsLoading } = useProStats();
  const { clients, loading: clientsLoading } = useClients();
  const { demandes, loading: demandesLoading } = useDemandes();
  const [localDemandes, setLocalDemandes] = useState<any[]>([]);

  // Charger les demandes depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ekicare_demandes');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalDemandes(parsed);
        } catch (error) {
          console.error('Erreur parsing localStorage:', error);
        }
      }
    }
  }, []);

  // Écouter les nouvelles demandes depuis le localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ekicare_demandes');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setLocalDemandes(parsed);
          } catch (error) {
            console.error('Erreur parsing localStorage:', error);
          }
        }
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les événements personnalisés de mise à jour des demandes
    const handleDemandeUpdate = () => {
      console.log('🔄 Mise à jour des demandes détectée');
      handleStorageChange();
    };

    window.addEventListener('demandeUpdated', handleDemandeUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('demandeUpdated', handleDemandeUpdate);
    };
  }, []);

  // Filtrer les demandes adressées à ce professionnel (API + localStorage)
  const allDemandes = [...demandes];
  
  // Ajouter les demandes du localStorage seulement si elles ne sont pas déjà dans l'API
  localDemandes.forEach(localDemande => {
    const existsInApi = demandes.some(apiDemande => apiDemande.id === localDemande.id);
    if (!existsInApi) {
      allDemandes.push(localDemande);
    }
  });

  const demandesPourCePro = allDemandes.filter(demande => {
    const matches = demande.pro_id === session?.user?.proProfile?.id;
    console.log(`🔍 Filtre demande ${demande.id}: pro_id=${demande.pro_id}, proProfile.id=${session?.user?.proProfile?.id}, matches=${matches}`);
    return matches;
  });

  // Profil du professionnel (récupéré depuis la session)
  const proProfile = session?.user?.proProfile;

  // Debug: Afficher les données
  console.log('🔍 Debug ProDashboardReal:');
  console.log('- Session:', session?.user);
  console.log('- ProProfile:', session?.user?.proProfile);
  console.log('- ProProfile ID:', session?.user?.proProfile?.id);
  console.log('- Demandes API:', demandes);
  console.log('- Demandes localStorage:', localDemandes);
  console.log('- Toutes les demandes:', allDemandes);
  console.log('- Demandes pour ce pro:', demandesPourCePro);
  
  // Debug: Vérifier chaque demande
  if (allDemandes.length > 0) {
    console.log('🔍 Détail des demandes:');
    allDemandes.forEach((demande, index) => {
      console.log(`- Demande ${index}:`, {
        id: demande.id,
        pro_id: demande.pro_id,
        pro_id_type: typeof demande.pro_id,
        pro_id_equals_1: demande.pro_id === '1',
        pro_id_equals_1_number: demande.pro_id === 1,
        statut: demande.statut,
        date: demande.date,
        proprio: demande.proprio?.nom
      });
    });
    
    console.log('🔍 ProProfile ID:', session?.user?.proProfile?.id);
    console.log('🔍 ProProfile ID type:', typeof session?.user?.proProfile?.id);
  }
  
  // Debug: Afficher les statuts des demandes
  const statutsUniques = [...new Set(demandesPourCePro.map(d => d.statut))];
  console.log('- Statuts uniques des demandes:', statutsUniques);

  // Transformer les demandes en format compatible avec VueMensuelleCompacte
  const demandesTransformees = demandesPourCePro.map(demande => {
    if (!demande || !demande.id) {
      console.warn('Demande invalide:', demande);
      return null;
    }

    const proprio = demande.proprio || {};
    const equide = demande.equide || {};
    
      const statutTransforme = demande.statut === 'EN_ATTENTE' ? 'en_attente' : 
                              demande.statut === 'ACCEPTEE' ? 'confirmé' : 
                              demande.statut === 'REFUSEE' ? 'annulé' : 
                              demande.statut === 'REPLANIFIEE' ? 'replanifié' : 'en_attente';
    
    console.log(`🔍 Demande ${demande.id}: statut original=${demande.statut}, statut transformé=${statutTransforme}, date=${demande.date}`);
    
    return {
      id: String(demande.id),
      date: demande.date ? new Date(demande.date).toISOString() : new Date().toISOString(),
      heure: demande.date ? new Date(demande.date).toISOString().split('T')[1].substring(0, 5) : '00:00',
      statut: statutTransforme,
      notes: String(demande.description || 'Demande de rendez-vous'),
      client: {
        id: String(proprio.id || ''),
        nom: String(proprio.nom || 'Client'),
        prenom: String(proprio.prenom || 'Inconnu'),
        telephone: String(proprio.telephone || ''),
        adresse: String(demande.adresse || 'Adresse non spécifiée'),
        ville: String(proprio.ville || '')
      },
      equide: {
        id: String(equide.id || ''),
        nom: String(equide.nom || 'Équidé'),
        race: String(equide.race || 'Inconnue'),
        age: Number(equide.age || 0)
      }
    };
  }).filter(Boolean); // Supprimer les valeurs null

  // Transformer les rendez-vous de l'API pour qu'ils correspondent au format de VueMensuelleCompacte
  const rendezVousTransformes = rendezVous.map(rdv => ({
    id: rdv.id,
    date: rdv.date ? new Date(rdv.date).toISOString() : new Date().toISOString(),
    heure: rdv.heure || '00:00',
    statut: rdv.statut || 'en_attente',
    notes: rdv.notes || 'Consultation',
    client: rdv.client ? {
      id: rdv.client.id || '',
      nom: rdv.client.nom || 'Client',
      prenom: rdv.client.prenom || 'Inconnu',
      telephone: rdv.client.telephone || '',
      adresse: rdv.client.adresse || '',
      ville: rdv.client.ville || ''
    } : undefined,
    equide: rdv.equide ? {
      id: rdv.equide.id || '',
      nom: rdv.equide.nom || 'Équidé',
      race: rdv.equide.race || 'Inconnue',
      age: rdv.equide.age || 0
    } : undefined
  }));

  // Combiner les rendez-vous de l'API et les demandes transformées
  const tousLesRendezVous = [...rendezVousTransformes, ...demandesTransformees];
  

  // Filtrer les rendez-vous "À venir" par DATE (futurs seulement)
  const rendezVousAvenir = tousLesRendezVous.filter(d => {
    if (!d || !d.date) return false;
    
    const dateRdv = new Date(d.date);
    const maintenant = new Date();
    
    // Rendez-vous futurs seulement
    return dateRdv > maintenant;
  });

  // Utiliser UNIQUEMENT les rendez-vous "À venir" pour la vue mensuelle
  const rendezVousAfficher = rendezVousAvenir;
  
  // Debug: Vérifier les données
  console.log('🔍 ProDashboardReal - Données disponibles:');
  console.log('- Rendez-vous API:', rendezVous.length, rendezVous);
  console.log('- Demandes pour ce pro:', demandesPourCePro.length, demandesPourCePro);
  console.log('- Demandes transformées:', demandesTransformees.length, demandesTransformees);
  console.log('- Rendez-vous transformés:', rendezVousTransformes.length, rendezVousTransformes);
  console.log('- Tous les rendez-vous:', tousLesRendezVous.length, tousLesRendezVous);
  console.log('- Rendez-vous À VENIR (futurs seulement):', rendezVousAvenir.length, rendezVousAvenir);
  console.log('- Rendez-vous à afficher:', rendezVousAfficher.length, rendezVousAfficher);
  
  // Debug détaillé du filtrage
  console.log('🔍 Debug filtrage À venir:');
  tousLesRendezVous.forEach((rdv, index) => {
    if (rdv && rdv.date) {
      const dateRdv = new Date(rdv.date);
      const maintenant = new Date();
      const isFuture = dateRdv > maintenant;
      console.log(`- RDV ${index}: date=${rdv.date}, statut=${rdv.statut}, isFuture=${isFuture}, passe=${isFuture}`);
    }
  });
  
  
  // Calculer les statistiques avec les demandes
  const demandesEnAttente = demandesPourCePro.filter(d => d.statut === 'EN_ATTENTE');
  const demandesAcceptees = demandesPourCePro.filter(d => d.statut === 'ACCEPTEE');
  const demandesRefusees = demandesPourCePro.filter(d => d.statut === 'REFUSEE');
  
  // Calculer les statistiques réelles
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // Rendez-vous d'aujourd'hui (demandes acceptées + rendez-vous API)
  const demandesAccepteesAujourdhui = demandesAcceptees.filter(demande => {
    const demandeDate = new Date(demande.date).toDateString();
    return demandeDate === today.toDateString();
  });
  
  const rendezVousAujourdhui = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date).toDateString();
    return rdvDate === today.toDateString();
  });
  
  const totalRendezVousAujourdhui = rendezVousAujourdhui.length + demandesAccepteesAujourdhui.length;
  
  // Rendez-vous cette semaine (demandes acceptées + rendez-vous API)
  const demandesAccepteesCetteSemaine = demandesAcceptees.filter(demande => {
    const demandeDate = new Date(demande.date);
    return demandeDate >= startOfWeek && demandeDate <= today;
  });
  
  const rendezVousCetteSemaine = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    return rdvDate >= startOfWeek && rdvDate <= today;
  });
  
  const totalRendezVousCetteSemaine = rendezVousCetteSemaine.length + demandesAccepteesCetteSemaine.length;
  
  // Clients actifs (propriétaires uniques des demandes acceptées)
  const clientsUniques = new Set(demandesAcceptees.map(d => d.proprio?.id).filter(Boolean));
  const totalClientsActifs = clientsUniques.size;
  
  // Debug: Afficher les statistiques
  console.log('🔍 Debug ProDashboardReal - Statistiques:');
  console.log('- Demandes en attente:', demandesEnAttente.length);
  console.log('- Demandes acceptées:', demandesAcceptees.length);
  console.log('- Demandes refusées:', demandesRefusees.length);
  console.log('- Rendez-vous à afficher:', rendezVousAfficher.length);
  console.log('- Rendez-vous aujourd\'hui:', totalRendezVousAujourdhui);
  console.log('- Rendez-vous cette semaine:', totalRendezVousCetteSemaine);
  console.log('- Clients actifs:', totalClientsActifs);
  console.log('- Clients uniques IDs:', Array.from(clientsUniques));
  console.log('- Demandes acceptées détail:', demandesAcceptees);
  console.log('- Rendez-vous à afficher détail:', rendezVousAfficher);
  console.log('- Tous les rendez-vous:', tousLesRendezVous);

  // Les statistiques sont déjà calculées ci-dessus

  if (rendezVousLoading || statsLoading || clientsLoading || demandesLoading || !session?.user?.proProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        {!session?.user?.proProfile && (
          <div className="text-center text-gray-500">
            Chargement du profil professionnel...
          </div>
        )}
      </div>
    );
  }

  return (
            <>
              <CleanDataButton />
              <CreateTablesButton />
              <div className="space-y-6">
      {/* En-tête */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B263B] mb-2">
              Tableau de bord Pro
            </h1>
            <p className="text-[#1B263B]/70">
              Gérez vos rendez-vous, vos clients et votre planning.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistiques colorées */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[#1B263B]/70">Aujourd'hui</p>
                      <p className="text-2xl font-bold text-[#1B263B]">
                        {totalRendezVousAujourdhui}
                      </p>
                    </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Cette semaine</p>
              <p className="text-2xl font-bold text-[#1B263B]">
                {totalRendezVousCetteSemaine}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Clients actifs</p>
              <p className="text-2xl font-bold text-[#1B263B]">
                {totalClientsActifs}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille des sections */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Rendez-vous du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[#1B263B] mb-2">
                      Rendez-vous d'aujourd'hui ({totalRendezVousAujourdhui})
                    </h2>
                    <p className="text-sm text-[#1B263B]/70">
                      Vos rendez-vous confirmés et demandes acceptées pour aujourd'hui
                    </p>
                  </div>
          {totalRendezVousAujourdhui > 0 ? (
            <div className="space-y-3">
              {/* Rendez-vous confirmés */}
              {rendezVousAujourdhui.map((rdv, index) => (
                <motion.div 
                  key={rdv.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">
                      {rdv.client ? `${rdv.client.nom} ${rdv.client.prenom}` : 'Client inconnu'} - {rdv.equide?.nom || 'Équidé inconnu'}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 self-start sm:self-auto">
                      {rdv.heure || 'Heure non définie'}
                    </span>
                  </div>
                  <div className="text-sm text-[#1B263B]/70 space-y-1">
                    <p>Type : {rdv.notes || 'Consultation'}</p>
                    <p>Statut : {rdv.statut}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Demandes acceptées */}
              {demandesAccepteesAujourdhui.map((demande, index) => (
                <motion.div 
                  key={demande.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (rendezVousAujourdhui.length + index) * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">
                      {(demande as any)?.proprio?.prenom} {(demande as any)?.proprio?.nom} - {(demande as any)?.equide?.nom}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 self-start sm:self-auto">
                      {new Date(demande.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm text-[#1B263B]/70 space-y-1">
                    <p>Type : {demande.description || 'Consultation'}</p>
                    <p>Statut : Accepté</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-medium text-[#1B263B] mb-1">Aucun rendez-vous</h3>
              <p className="text-sm text-[#1B263B]/70">Vous n'avez pas de rendez-vous aujourd'hui.</p>
            </div>
          )}
        </motion.div>

        {/* Vue mensuelle des rendez-vous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <VueMensuelleCompacte 
            rendezVous={rendezVousAfficher}
            demandesAcceptees={[]}
            loading={rendezVousLoading || demandesLoading}
          />
        </motion.div>
      </motion.div>


      </div>
    </>
  );
}
