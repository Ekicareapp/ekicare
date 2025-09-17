const fs = require('fs');
const path = require('path');

const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-${Date.now()}
NEXTAUTH_URL=http://localhost:3001

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Places API (optional)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env.local créé avec succès !');
  console.log('📝 Veuillez maintenant :');
  console.log('1. Ouvrir le fichier .env.local');
  console.log('2. Remplacer les valeurs par vos vraies clés Supabase');
  console.log('3. Redémarrer le serveur avec: npm run dev');
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env.local:', error);
}

