require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addColumnsToSupabase() {
    console.log('🔧 Ajout des colonnes dans Supabase...');

    try {
        // 1. Ajouter la colonne duree_consultation
        console.log('\n📝 Ajout de la colonne duree_consultation...');
        const { data: dureeData, error: dureeError } = await supabase
            .rpc('exec_sql', {
                sql: `
                    ALTER TABLE pro_profiles 
                    ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;
                `
            });

        if (dureeError) {
            console.log('⚠️ Erreur pour duree_consultation (peut-être déjà existante):', dureeError.message);
        } else {
            console.log('✅ Colonne duree_consultation ajoutée avec succès');
        }

        // 2. Ajouter la colonne disponibilites
        console.log('\n📝 Ajout de la colonne disponibilites...');
        const { data: dispoData, error: dispoError } = await supabase
            .rpc('exec_sql', {
                sql: `
                    ALTER TABLE pro_profiles 
                    ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
                        "lundi": {"matin": true, "apresMidi": true, "soir": false},
                        "mardi": {"matin": true, "apresMidi": true, "soir": false},
                        "mercredi": {"matin": true, "apresMidi": true, "soir": false},
                        "jeudi": {"matin": true, "apresMidi": true, "soir": false},
                        "vendredi": {"matin": true, "apresMidi": true, "soir": false},
                        "samedi": {"matin": true, "apresMidi": false, "soir": false},
                        "dimanche": {"matin": false, "apresMidi": false, "soir": false}
                    }'::jsonb;
                `
            });

        if (dispoError) {
            console.log('⚠️ Erreur pour disponibilites (peut-être déjà existante):', dispoError.message);
        } else {
            console.log('✅ Colonne disponibilites ajoutée avec succès');
        }

        // 3. Mettre à jour les enregistrements existants avec des valeurs par défaut
        console.log('\n🔄 Mise à jour des enregistrements existants...');
        const { error: updateError } = await supabase
            .from('pro_profiles')
            .update({
                duree_consultation: 60,
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
            .is('duree_consultation', null);

        if (updateError) {
            console.log('⚠️ Note lors de la mise à jour:', updateError.message);
        } else {
            console.log('✅ Enregistrements mis à jour avec les valeurs par défaut');
        }

        // 4. Vérifier que les colonnes existent maintenant
        console.log('\n🔍 Vérification des colonnes...');
        const { data: testData, error: testError } = await supabase
            .from('pro_profiles')
            .select('duree_consultation, disponibilites')
            .limit(1);

        if (testError) {
            console.error('❌ Les colonnes n\'ont pas pu être ajoutées:', testError.message);
            console.log('\n📋 Solution alternative:');
            console.log('1. Allez dans l\'interface Supabase');
            console.log('2. Ouvrez l\'onglet "SQL Editor"');
            console.log('3. Exécutez ces requêtes SQL:');
            console.log(`
ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;

ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
  "lundi": {"matin": true, "apresMidi": true, "soir": false},
  "mardi": {"matin": true, "apresMidi": true, "soir": false},
  "mercredi": {"matin": true, "apresMidi": true, "soir": false},
  "jeudi": {"matin": true, "apresMidi": true, "soir": false},
  "vendredi": {"matin": true, "apresMidi": true, "soir": false},
  "samedi": {"matin": true, "apresMidi": false, "soir": false},
  "dimanche": {"matin": false, "apresMidi": false, "soir": false}
}'::jsonb;
            `);
            return;
        }

        console.log('✅ Vérification réussie ! Les colonnes existent maintenant.');
        console.log('📊 Données de test:', testData);

        console.log('\n🎉 Colonnes ajoutées avec succès !');
        console.log('✅ Le professionnel peut maintenant gérer ses disponibilités et la durée de ses consultations.');

    } catch (error) {
        console.error('❌ Erreur générale:', error);
        console.log('\n📋 Solution alternative:');
        console.log('1. Allez dans l\'interface Supabase');
        console.log('2. Ouvrez l\'onglet "SQL Editor"');
        console.log('3. Exécutez ces requêtes SQL:');
        console.log(`
ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;

ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
  "lundi": {"matin": true, "apresMidi": true, "soir": false},
  "mardi": {"matin": true, "apresMidi": true, "soir": false},
  "mercredi": {"matin": true, "apresMidi": true, "soir": false},
  "jeudi": {"matin": true, "apresMidi": true, "soir": false},
  "vendredi": {"matin": true, "apresMidi": true, "soir": false},
  "samedi": {"matin": true, "apresMidi": false, "soir": false},
  "dimanche": {"matin": false, "apresMidi": false, "soir": false}
}'::jsonb;
        `);
    }
}

addColumnsToSupabase();

