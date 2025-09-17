// Script pour nettoyer la base de données Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDatabase() {
  try {
    console.log('🧹 Nettoyage de la base de données Supabase...');

    // 1. Supprimer tous les rendez-vous
    console.log('📅 Suppression des rendez-vous...');
    const { error: rdvError } = await supabase
      .from('rendez_vous')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (rdvError) {
      console.error('❌ Erreur lors de la suppression des rendez-vous:', rdvError);
    } else {
      console.log('✅ Rendez-vous supprimés');
    }

    // 2. Supprimer toutes les demandes
    console.log('📋 Suppression des demandes...');
    const { error: demandesError } = await supabase
      .from('demandes')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (demandesError) {
      console.error('❌ Erreur lors de la suppression des demandes:', demandesError);
    } else {
      console.log('✅ Demandes supprimées');
    }

    // 3. Supprimer tous les clients
    console.log('👥 Suppression des clients...');
    const { error: clientsError } = await supabase
      .from('clients')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (clientsError) {
      console.error('❌ Erreur lors de la suppression des clients:', clientsError);
    } else {
      console.log('✅ Clients supprimés');
    }

    // 4. Supprimer toutes les tournées
    console.log('🚗 Suppression des tournées...');
    const { error: tourneesError } = await supabase
      .from('tournees')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (tourneesError) {
      console.error('❌ Erreur lors de la suppression des tournées:', tourneesError);
    } else {
      console.log('✅ Tournées supprimées');
    }

    console.log('🎉 Base de données nettoyée avec succès !');
    console.log('💡 Rechargez votre application pour voir les changements');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

cleanDatabase();

