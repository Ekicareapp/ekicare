-- Script pour créer un utilisateur de test
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un utilisateur de test (mot de passe: password123)
INSERT INTO users (id, email, password, role) VALUES 
(
  'user-1',
  'pro@test.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4KzJfQ8P2e', -- password123
  'PROFESSIONAL'
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role;

-- Vérifier que l'utilisateur a été créé
SELECT 'Utilisateur créé avec succès!' as status;
SELECT id, email, role FROM users WHERE email = 'pro@test.com';
