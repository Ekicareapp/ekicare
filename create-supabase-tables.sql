-- Script pour créer toutes les tables dans Supabase
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Table users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PROPRIETAIRE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table proprio_profiles
CREATE TABLE IF NOT EXISTS proprio_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table pro_profiles
CREATE TABLE IF NOT EXISTS pro_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  profession TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  description TEXT,
  experience INTEGER DEFAULT 0,
  tarif_min INTEGER DEFAULT 0,
  tarif_max INTEGER DEFAULT 0,
  photo_profil TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Table equides
CREATE TABLE IF NOT EXISTS equides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proprio_id UUID NOT NULL,
  nom TEXT NOT NULL,
  age INTEGER NOT NULL,
  race TEXT NOT NULL,
  sexe TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proprio_id) REFERENCES proprio_profiles(id) ON DELETE CASCADE
);

-- 5. Table demandes
CREATE TABLE IF NOT EXISTS demandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proprio_id UUID NOT NULL,
  equide_id UUID NOT NULL,
  pro_id UUID,
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  adresse TEXT NOT NULL,
  description TEXT NOT NULL,
  creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proprio_id) REFERENCES proprio_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (equide_id) REFERENCES equides(id) ON DELETE CASCADE,
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE
);

-- 6. Table clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre_equides INTEGER DEFAULT 0,
  dernier_rendez_vous TIMESTAMP WITH TIME ZONE,
  total_rendez_vous INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'actif',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE
);

-- 7. Table rendez_vous
CREATE TABLE IF NOT EXISTS rendez_vous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demande_id UUID UNIQUE NOT NULL,
  pro_id UUID NOT NULL,
  client_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'CONFIRME',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE CASCADE,
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 8. Table disponibilites
CREATE TABLE IF NOT EXISTS disponibilites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL,
  jour TEXT NOT NULL,
  matin BOOLEAN DEFAULT FALSE,
  apres_midi BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE,
  UNIQUE(pro_id, jour)
);

-- 9. Table certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL,
  nom TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE
);

-- 10. Table tournees
CREATE TABLE IF NOT EXISTS tournees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL,
  rendez_vous_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'PLANIFIEE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous(id) ON DELETE CASCADE
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_proprio_profiles_user_id ON proprio_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_user_id ON pro_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_equides_proprio_id ON equides(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
CREATE INDEX IF NOT EXISTS idx_clients_pro_id ON clients(pro_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_pro_id ON rendez_vous(pro_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_client_id ON rendez_vous(client_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut ON rendez_vous(statut);
CREATE INDEX IF NOT EXISTS idx_disponibilites_pro_id ON disponibilites(pro_id);
CREATE INDEX IF NOT EXISTS idx_certifications_pro_id ON certifications(pro_id);
CREATE INDEX IF NOT EXISTS idx_tournees_pro_id ON tournees(pro_id);

-- Activer RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE proprio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equides ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilites ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournees ENABLE ROW LEVEL SECURITY;
