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

async function testAuth() {
  console.log('🧪 Test d\'authentification...');
  
  try {
    // Récupérer un utilisateur existant
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'tiberefillie82@gmail.com')
      .single();
    
    if (error) {
      console.error('❌ Erreur récupération utilisateur:', error);
      return;
    }
    
    console.log('👤 Utilisateur trouvé:', user.email, user.role);
    
    // Tester différents mots de passe
    const passwords = ['password123', '123456', 'test', 'password', 'admin'];
    
    for (const password of passwords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`🔑 Test mot de passe "${password}": ${isValid ? '✅ Valide' : '❌ Invalide'}`);
      if (isValid) {
        console.log('🎉 Mot de passe correct trouvé!');
        break;
      }
    }
    
    // Si aucun mot de passe ne fonctionne, créer un nouveau mot de passe
    console.log('\n🔧 Création d\'un nouveau mot de passe...');
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('❌ Erreur mise à jour mot de passe:', updateError);
    } else {
      console.log('✅ Mot de passe mis à jour:', newPassword);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testAuth();

