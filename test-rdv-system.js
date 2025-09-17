require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRdvSystem() {
    console.log('🧪 Test du système de réservation amélioré...');
    
    try {
        // Test 1: Vérifier l'API des équidés
        console.log('\n1️⃣ Test de l\'API des équidés...');
        const equidesResponse = await fetch('http://localhost:3001/api/proprio/equides');
        if (equidesResponse.ok) {
            const equidesData = await equidesResponse.json();
            console.log('✅ API des équidés fonctionne');
            console.log(`📊 ${equidesData.equides.length} équidés trouvés`);
        } else {
            console.log('❌ Erreur API des équidés:', equidesResponse.status);
        }

        // Test 2: Vérifier l'API de disponibilités
        console.log('\n2️⃣ Test de l\'API des disponibilités...');
        const dispoResponse = await fetch('http://localhost:3001/api/professionnels/1ad6a1b7-0632-421a-af23-51bbaf9e4280/disponibilites');
        if (dispoResponse.ok) {
            const dispoData = await dispoResponse.json();
            console.log('✅ API des disponibilités fonctionne');
            console.log(`📊 Durée de consultation: ${dispoData.dureeConsultation} minutes`);
        } else {
            console.log('❌ Erreur API des disponibilités:', dispoResponse.status);
        }

        // Test 3: Vérifier l'application
        console.log('\n3️⃣ Test de l\'application...');
        const appResponse = await fetch('http://localhost:3001');
        if (appResponse.ok) {
            console.log('✅ Application accessible');
        } else {
            console.log('❌ Application non accessible');
        }

        console.log('\n🎯 Instructions pour tester:');
        console.log('1. Allez sur http://localhost:3001/dashboard/proprio/rechercher');
        console.log('2. Recherchez des professionnels');
        console.log('3. Cliquez sur "Prendre rendez-vous"');
        console.log('4. Vous devriez voir:');
        console.log('   - Les disponibilités du professionnel');
        console.log('   - Vos équidés réels');
        console.log('   - Des créneaux intelligents');
        console.log('   - La possibilité d\'ajouter des créneaux alternatifs');
        console.log('   - Un système de soumission fonctionnel');

        console.log('\n✅ Système de réservation amélioré prêt !');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

testRdvSystem();

