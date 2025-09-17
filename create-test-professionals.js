const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestProfessionals() {
  console.log('=== CRÉATION DE PROFESSIONNELS DE TEST ===');

  const testProfessionals = [
    {
      email: 'vet1@test.com',
      password: 'password123',
      nom: 'Martin',
      prenom: 'Dr. Sophie',
      telephone: '01 23 45 67 89',
      profession: 'Vétérinaire équin',
      ville: 'Paris',
      rayon_exercice: 50,
      description: 'Vétérinaire spécialisée en médecine équine avec 10 ans d\'expérience.',
      tarif_min: 80,
      tarif_max: 120
    },
    {
      email: 'maréchal1@test.com',
      password: 'password123',
      nom: 'Dubois',
      prenom: 'Pierre',
      telephone: '01 23 45 67 90',
      profession: 'Maréchal-ferrant',
      ville: 'Lyon',
      rayon_exercice: 75,
      description: 'Maréchal-ferrant expérimenté, spécialisé dans le parage et la ferrure des chevaux de sport.',
      tarif_min: 60,
      tarif_max: 90
    },
    {
      email: 'osteo1@test.com',
      password: 'password123',
      nom: 'Leroy',
      prenom: 'Marie',
      telephone: '01 23 45 67 91',
      profession: 'Ostéopathe équin',
      ville: 'Marseille',
      rayon_exercice: 100,
      description: 'Ostéopathe équin certifiée, spécialisée dans les troubles musculo-squelettiques.',
      tarif_min: 70,
      tarif_max: 100
    },
    {
      email: 'dentiste1@test.com',
      password: 'password123',
      nom: 'Moreau',
      prenom: 'Dr. Jean',
      telephone: '01 23 45 67 92',
      profession: 'Dentiste équin',
      ville: 'Toulouse',
      rayon_exercice: 60,
      description: 'Dentiste équin spécialisé dans les soins dentaires et la chirurgie buccale.',
      tarif_min: 90,
      tarif_max: 150
    }
  ];

  for (const pro of testProfessionals) {
    try {
      console.log(`\n--- Création de ${pro.prenom} ${pro.nom} ---`);

      // 1. Créer l'utilisateur
      const hashedPassword = await bcrypt.hash(pro.password, 12);
      
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: pro.email,
          password: hashedPassword,
          role: 'PROFESSIONNEL'
        })
        .select()
        .single();

      if (userError) {
        console.error('Erreur création utilisateur:', userError);
        continue;
      }

      console.log('✅ Utilisateur créé:', user.id);

      // 2. Créer le profil professionnel
      const { error: proError } = await supabase
        .from('pro_profiles')
        .insert({
          user_id: user.id,
          nom: pro.nom,
          prenom: pro.prenom,
          telephone: pro.telephone,
          profession: pro.profession,
          adresse: pro.ville,
          ville: pro.ville,
          code_postal: '75000',
          description: pro.description,
          experience: 5,
          tarif_min: pro.tarif_min,
          tarif_max: pro.tarif_max,
          rayon_exercice: pro.rayon_exercice,
          siret: '12345678901234'
        });

      if (proError) {
        console.error('Erreur création profil pro:', proError);
        continue;
      }

      console.log('✅ Profil professionnel créé');

    } catch (error) {
      console.error('Erreur générale:', error);
    }
  }

  console.log('\n=== CRÉATION TERMINÉE ===');
}

createTestProfessionals();


