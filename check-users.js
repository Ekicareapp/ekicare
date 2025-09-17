const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Vérification des utilisateurs...');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log(`📊 ${users.length} utilisateurs trouvés:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.id}`);
    });
    
    if (users.length === 0) {
      console.log('⚠️ Aucun utilisateur trouvé. Créons des comptes de test...');
      
      // Créer un compte propriétaire de test
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: 'test@proprio.com',
          password: hashedPassword,
          role: 'PROPRIETAIRE'
        })
        .select()
        .single();
      
      if (userError) {
        console.error('❌ Erreur création utilisateur:', userError);
      } else {
        console.log('✅ Utilisateur propriétaire créé:', newUser.email);
        
        // Créer le profil propriétaire
        const { error: proprioError } = await supabase
          .from('proprio_profiles')
          .insert({
            user_id: newUser.id,
            nom: 'Test',
            prenom: 'Proprio',
            telephone: '0123456789',
            adresse: 'Test Adresse',
            ville: 'Test Ville',
            code_postal: '12345'
          });
        
        if (proprioError) {
          console.error('❌ Erreur création profil propriétaire:', proprioError);
        } else {
          console.log('✅ Profil propriétaire créé');
        }
      }
      
      // Créer un compte professionnel de test
      const { data: newPro, error: proError } = await supabase
        .from('users')
        .insert({
          email: 'test@pro.com',
          password: hashedPassword,
          role: 'PROFESSIONNEL'
        })
        .select()
        .single();
      
      if (proError) {
        console.error('❌ Erreur création professionnel:', proError);
      } else {
        console.log('✅ Utilisateur professionnel créé:', newPro.email);
        
        // Créer le profil professionnel
        const { error: proProfileError } = await supabase
          .from('pro_profiles')
          .insert({
            user_id: newPro.id,
            nom: 'Test',
            prenom: 'Pro',
            telephone: '0987654321',
            profession: 'Vétérinaire',
            adresse: 'Pro Adresse',
            ville: 'Pro Ville',
            code_postal: '54321',
            description: 'Professionnel de test',
            experience: 5,
            tarif_min: 50,
            tarif_max: 100,
            rayon_exercice: 30
          });
        
        if (proProfileError) {
          console.error('❌ Erreur création profil professionnel:', proProfileError);
        } else {
          console.log('✅ Profil professionnel créé');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

checkUsers();

