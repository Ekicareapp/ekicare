require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEquidesFix() {
    console.log('🔧 Test de la correction des équidés...');
    
    try {
        // Tester la requête corrigée
        const { data: equides, error } = await supabase
            .from('equides')
            .select('id, nom, age, race, sexe, user_id')
            .eq('user_id', '0a2f64e6-960f-4e1c-885e-cedd39e40190') // ID d'un utilisateur existant
            .limit(3);

        if (error) {
            console.log('❌ Erreur avec la requête corrigée:', error.message);
        } else {
            console.log('✅ Requête corrigée fonctionne !');
            console.log(`📊 ${equides.length} équidés trouvés`);
            equides.forEach((equide, index) => {
                console.log(`  ${index + 1}. ${equide.nom} (${equide.race}, ${equide.age} ans, ${equide.sexe})`);
            });
        }

        console.log('\n🎯 Instructions pour tester:');
        console.log('1. Allez sur http://localhost:3001/dashboard/proprio/rechercher');
        console.log('2. Connectez-vous avec un compte propriétaire');
        console.log('3. Recherchez des professionnels');
        console.log('4. Cliquez sur "Prendre rendez-vous"');
        console.log('5. Vous devriez maintenant voir vos équidés !');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

testEquidesFix();

