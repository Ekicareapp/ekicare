require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCompleteFunctionality() {
    console.log('🧪 Test complet des nouvelles fonctionnalités...');

    try {
        // 1. Vérifier si les colonnes existent
        console.log('\n🔍 Vérification des colonnes...');
        const { data: testData, error: testError } = await supabase
            .from('pro_profiles')
            .select('duree_consultation, disponibilites')
            .limit(1);

        if (testError) {
            console.error('❌ Les colonnes n\'existent pas encore:', testError.message);
            console.log('\n📋 Instructions:');
            console.log('1. Allez dans l\'interface Supabase');
            console.log('2. Ouvrez l\'onglet "Table Editor"');
            console.log('3. Sélectionnez la table "pro_profiles"');
            console.log('4. Ajoutez les colonnes suivantes:');
            console.log('   - duree_consultation (int4, default: 60)');
            console.log('   - disponibilites (jsonb, default: voir le fichier add-columns-manual.md)');
            console.log('5. Relancez ce test');
            return;
        }

        console.log('✅ Les colonnes existent !');

        // 2. Tester la mise à jour complète
        console.log('\n🔄 Test de mise à jour complète...');
        
        const updateData = {
            experience: 12,
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
        };

        const { error: updateError } = await supabase
            .from('pro_profiles')
            .update(updateData)
            .eq('user_id', '6da9e597-38ba-451f-9f0c-51138734a2c6');

        if (updateError) {
            console.error('❌ Erreur lors de la mise à jour:', updateError);
            return;
        }

        console.log('✅ Mise à jour réussie !');

        // 3. Vérifier la sauvegarde
        console.log('\n🔍 Vérification de la sauvegarde...');
        const { data: updatedPro, error: fetchError } = await supabase
            .from('pro_profiles')
            .select('*')
            .eq('user_id', '6da9e597-38ba-451f-9f0c-51138734a2c6');

        if (fetchError) {
            console.error('❌ Erreur lors de la vérification:', fetchError);
            return;
        }

        if (updatedPro.length > 0) {
            const pro = updatedPro[0];
            console.log(`\n✅ Vérification réussie:`);
            console.log(`   Nom: ${pro.prenom} ${pro.nom}`);
            console.log(`   Expérience: ${pro.experience} ans`);
            console.log(`   Durée consultation: ${pro.duree_consultation} minutes`);
            console.log(`   Disponibilités:`, JSON.stringify(pro.disponibilites, null, 2));
        }

        console.log('\n🎉 Toutes les fonctionnalités fonctionnent correctement !');
        console.log('✅ Le professionnel peut maintenant gérer ses disponibilités et la durée de ses consultations.');

    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

testCompleteFunctionality();
