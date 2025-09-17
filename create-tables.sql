-- Script pour créer les tables demandes et rendez_vous dans Supabase

-- 1. Créer la table demandes
CREATE TABLE IF NOT EXISTS demandes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proprio_id TEXT NOT NULL,
  equide_id TEXT NOT NULL,
  pro_id TEXT,
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  adresse TEXT NOT NULL,
  description TEXT NOT NULL,
  creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table rendez_vous
CREATE TABLE IF NOT EXISTS rendez_vous (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  demande_id TEXT UNIQUE NOT NULL,
  pro_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'CONFIRME',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_pro_id ON rendez_vous(pro_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_client_id ON rendez_vous(client_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut ON rendez_vous(statut);

-- 4. Créer les contraintes de clés étrangères
ALTER TABLE demandes 
ADD CONSTRAINT fk_demandes_proprio_id 
FOREIGN KEY (proprio_id) REFERENCES proprio_profiles(id) ON DELETE CASCADE;

ALTER TABLE demandes 
ADD CONSTRAINT fk_demandes_equide_id 
FOREIGN KEY (equide_id) REFERENCES equides(id) ON DELETE CASCADE;

ALTER TABLE demandes 
ADD CONSTRAINT fk_demandes_pro_id 
FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE;

ALTER TABLE rendez_vous 
ADD CONSTRAINT fk_rendez_vous_demande_id 
FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE CASCADE;

ALTER TABLE rendez_vous 
ADD CONSTRAINT fk_rendez_vous_pro_id 
FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE;

ALTER TABLE rendez_vous 
ADD CONSTRAINT fk_rendez_vous_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

-- 5. Activer RLS (Row Level Security)
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;

-- 6. Créer les politiques RLS pour demandes
CREATE POLICY "Les propriétaires peuvent voir leurs demandes" ON demandes
  FOR SELECT USING (
    proprio_id IN (
      SELECT id FROM proprio_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les professionnels peuvent voir les demandes qui leur sont adressées" ON demandes
  FOR SELECT USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les propriétaires peuvent créer des demandes" ON demandes
  FOR INSERT WITH CHECK (
    proprio_id IN (
      SELECT id FROM proprio_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les professionnels peuvent mettre à jour les demandes qui leur sont adressées" ON demandes
  FOR UPDATE USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

-- 7. Créer les politiques RLS pour rendez_vous
CREATE POLICY "Les professionnels peuvent voir leurs rendez-vous" ON rendez_vous
  FOR SELECT USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les propriétaires peuvent voir les rendez-vous de leurs demandes" ON rendez_vous
  FOR SELECT USING (
    demande_id IN (
      SELECT id FROM demandes WHERE proprio_id IN (
        SELECT id FROM proprio_profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Les professionnels peuvent créer des rendez-vous" ON rendez_vous
  FOR INSERT WITH CHECK (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les professionnels peuvent mettre à jour leurs rendez-vous" ON rendez_vous
  FOR UPDATE USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

