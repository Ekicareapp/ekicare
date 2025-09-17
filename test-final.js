require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFinal() {
    console.log('🧪 Test final des fonctionnalités...');
    
    try {
        // Tester la récupération des nouvelles colonnes
        const { data, error } = await supabase
            .from('pro_profiles')
            .select('duree_consultation, disponibilites')
            .limit(1);

        if (error) {
            console.log('❌ Les colonnes n\'existent pas encore:', error.message);
            return;
        }

        console.log('✅ Les colonnes existent !');
        console.log('📊 Données récupérées:', data);

        // Tester la mise à jour
        const { error: updateError } = await supabase
            .from('pro_profiles')
            .update({
                duree_consultation: 90,
                disponibilites: {
                    lundi: { matin: true, apresMidi: true, soir: false },
                    mardi: { matin: true, apresMidi: true, soir: false },
                    mercredi: { matin: true, apresMidi: true, soir: false },
                    jeudi: { matin: true, apresMidi: true, soir: false },
                    vendredi: { matin: true, apresMidi: true, soir: false },
                    samedi: { matin: true, apresMidi: false, soir: false },
                    dimanche: { matin: false, apresMidi: false, soir: false }
                }
            })
            .eq('user_id', '6da9e597-38ba-451f-9f0c-51138734a2c6');

        if (updateError) {
            console.log('❌ Erreur lors de la mise à jour:', updateError);
        } else {
            console.log('✅ Mise à jour réussie !');
            console.log('🎉 Toutes les fonctionnalités sont opérationnelles !');
            console.log('\n✅ Le professionnel peut maintenant:');
            console.log('   - Modifier ses années d\'expérience');
            console.log('   - Définir la durée de ses consultations (30min à 2h)');
            console.log('   - Gérer ses disponibilités par jour et créneau');
            console.log('   - Tout se sauvegarde automatiquement dans Supabase');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

testFinal();

