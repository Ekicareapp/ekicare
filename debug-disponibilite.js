require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugDisponibilite() {
    console.log('🔍 Debug de la disponibilité...');
    
    try {
        // Récupérer les disponibilités du professionnel
        const { data: proProfile, error } = await supabase
            .from('pro_profiles')
            .select('duree_consultation, disponibilites')
            .eq('id', '1ad6a1b7-0632-421a-af23-51bbaf9e4280')
            .single();

        if (error || !proProfile) {
            console.log('❌ Erreur:', error);
            return;
        }

        console.log('📊 Profil professionnel:');
        console.log('  - Durée consultation:', proProfile.duree_consultation);
        console.log('  - Disponibilités:', JSON.stringify(proProfile.disponibilites, null, 2));

        // Tester différentes dates
        const testDates = [
            '2024-01-15', // Lundi
            '2024-01-16', // Mardi
            '2024-01-17', // Mercredi
            '2024-01-18', // Jeudi
            '2024-01-19', // Vendredi
            '2024-01-20', // Samedi
            '2024-01-21'  // Dimanche
        ];

        const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const nomsJours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        console.log('\n📅 Test des dates:');
        testDates.forEach(date => {
            const dateObj = new Date(date);
            const jourIndex = dateObj.getDay();
            const jour = jours[jourIndex];
            const nomJour = nomsJours[jourIndex];
            
            const disponibilites = proProfile.disponibilites || {};
            const jourDispo = disponibilites[jour];
            
            const isDisponible = jourDispo ? 
                (jourDispo.matin || jourDispo.apresMidi || jourDispo.soir) : 
                false;
            
            console.log(`  ${date} (${nomJour}): ${isDisponible ? '✅ Disponible' : '❌ Indisponible'}`);
            if (jourDispo) {
                console.log(`    - Matin: ${jourDispo.matin ? '✅' : '❌'}`);
                console.log(`    - Après-midi: ${jourDispo.apresMidi ? '✅' : '❌'}`);
                console.log(`    - Soir: ${jourDispo.soir ? '✅' : '❌'}`);
            }
        });

    } catch (error) {
        console.error('❌ Erreur lors du debug:', error);
    }
}

debugDisponibilite();
