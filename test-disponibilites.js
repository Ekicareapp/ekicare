require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDisponibilites() {
    console.log('🧪 Test du système de disponibilités intelligentes...');
    
    try {
        // Récupérer un professionnel pour tester
        const { data: pro, error } = await supabase
            .from('pro_profiles')
            .select('id, nom, prenom, duree_consultation, disponibilites')
            .limit(1)
            .single();

        if (error || !pro) {
            console.error('❌ Aucun professionnel trouvé:', error);
            return;
        }

        console.log(`✅ Professionnel trouvé: ${pro.prenom} ${pro.nom}`);
        console.log(`📊 Durée de consultation: ${pro.duree_consultation || 60} minutes`);
        console.log('📅 Disponibilités:');
        
        Object.entries(pro.disponibilites || {}).forEach(([jour, creneaux]) => {
            const creneauxDispo = [];
            if (creneaux.matin) creneauxDispo.push('Matin');
            if (creneaux.apresMidi) creneauxDispo.push('Après-midi');
            if (creneaux.soir) creneauxDispo.push('Soir');
            
            console.log(`  ${jour}: ${creneauxDispo.length > 0 ? creneauxDispo.join(', ') : 'Indisponible'}`);
        });

        // Tester l'API
        console.log('\n🔗 Test de l\'API de disponibilités...');
        const response = await fetch(`http://localhost:3001/api/professionnels/${pro.id}/disponibilites`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API fonctionne correctement');
            console.log('📊 Données récupérées:', data);
        } else {
            console.log('❌ Erreur API:', response.status, await response.text());
        }

        console.log('\n🎯 Instructions pour tester:');
        console.log('1. Allez sur http://localhost:3001/dashboard/proprio/rechercher');
        console.log('2. Recherchez des professionnels');
        console.log('3. Cliquez sur "Prendre rendez-vous"');
        console.log('4. Vous devriez voir les disponibilités et créneaux intelligents !');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

testDisponibilites();

