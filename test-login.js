// Test de connexion
const testLogin = async () => {
  console.log('🧪 Test de connexion...');
  
  try {
    // Test avec un compte propriétaire
    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'test@proprio.com',
        password: 'password123',
        rememberMe: 'false'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Connexion réussie');
    } else {
      const text = await response.text();
      console.log('❌ Erreur de connexion:', text);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testLogin();

