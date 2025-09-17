// Script pour créer la table demandes directement
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (utilise les variables d'environnement du processus Next.js)
const supabaseUrl = 'https://your-project.supabase.co'; // Remplacer par l'URL réelle
const supabaseKey = 'your-anon-key'; // Remplacer par la clé réelle

// Pour l'instant, on va utiliser l'approche SQL directe
console.log('🔄 Création de la table demandes...');

// Instructions pour créer la table manuellement
console.log(`
📋 Pour créer la table demandes, exécutez ce SQL dans l'éditeur SQL de Supabase :

CREATE TABLE IF NOT EXISTS demandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proprio_id UUID NOT NULL,
  equide_id UUID NOT NULL,
  pro_id UUID,
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  description TEXT NOT NULL,
  creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proprio_id) REFERENCES proprio_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (equide_id) REFERENCES equides(id) ON DELETE CASCADE,
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);

-- Activer RLS
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
`);

console.log('✅ Instructions générées ! Copiez et exécutez le SQL ci-dessus dans Supabase.');
