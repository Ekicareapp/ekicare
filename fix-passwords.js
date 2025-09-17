const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPasswords() {
  console.log('🔧 Correction des mots de passe...');
  
  try {
    // Récupérer tous les utilisateurs
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Erreur récupération utilisateurs:', error);
      return;
    }
    
    console.log(`📊 ${users.length} utilisateurs trouvés`);
    
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    for (const user of users) {
      console.log(`🔑 Mise à jour mot de passe pour ${user.email} (${user.role})...`);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', user.id);
      
      if (updateError) {
        console.error(`❌ Erreur pour ${user.email}:`, updateError);
      } else {
        console.log(`✅ Mot de passe mis à jour pour ${user.email}`);
      }
    }
    
    console.log('\n🎉 Tous les mots de passe ont été mis à jour!');
    console.log('📝 Identifiants de connexion:');
    console.log('   Email: [email de votre choix]');
    console.log('   Mot de passe: password123');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

fixPasswords();

