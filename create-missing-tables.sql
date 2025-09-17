-- Création de la table demandes
CREATE TABLE IF NOT EXISTS demandes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    equide_id UUID NOT NULL REFERENCES equides(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'consultation',
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    adresse TEXT NOT NULL,
    telephone VARCHAR(20),
    description TEXT NOT NULL,
    creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table rendez_vous
CREATE TABLE IF NOT EXISTS rendez_vous (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    demande_id UUID NOT NULL REFERENCES demandes(id) ON DELETE CASCADE,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    equide_id UUID NOT NULL REFERENCES equides(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duree INTEGER NOT NULL DEFAULT 60, -- en minutes
    adresse TEXT NOT NULL,
    description TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'CONFIRME',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table clients (relation pro-proprio)
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pro_id, proprio_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_pro_id ON rendez_vous(pro_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_proprio_id ON rendez_vous(proprio_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_date ON rendez_vous(date);
CREATE INDEX IF NOT EXISTS idx_clients_pro_id ON clients(pro_id);
CREATE INDEX IF NOT EXISTS idx_clients_proprio_id ON clients(proprio_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_demandes_updated_at BEFORE UPDATE ON demandes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rendez_vous_updated_at BEFORE UPDATE ON rendez_vous FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

