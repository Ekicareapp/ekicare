import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          role: 'PROPRIETAIRE' | 'PROFESSIONNEL'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          role: 'PROPRIETAIRE' | 'PROFESSIONNEL'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          role?: 'PROPRIETAIRE' | 'PROFESSIONNEL'
          created_at?: string
          updated_at?: string
        }
      }
      pro_profiles: {
        Row: {
          id: string
          user_id: string
          nom: string
          prenom: string
          telephone: string
          profession: string
          adresse: string | null
          ville: string | null
          code_postal: string | null
          description: string | null
          experience: number
          tarif_min: number
          tarif_max: number
          rayon_exercice: number | null
          siret: string | null
          photo_profil: string | null
          duree_consultation: number | null
          disponibilites: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          prenom: string
          telephone: string
          profession: string
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          description?: string | null
          experience?: number
          tarif_min?: number
          tarif_max?: number
          rayon_exercice?: number | null
          siret?: string | null
          photo_profil?: string | null
          duree_consultation?: number | null
          disponibilites?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          prenom?: string
          telephone?: string
          profession?: string
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          description?: string | null
          experience?: number
          tarif_min?: number
          tarif_max?: number
          rayon_exercice?: number | null
          siret?: string | null
          photo_profil?: string | null
          duree_consultation?: number | null
          disponibilites?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      proprio_profiles: {
        Row: {
          id: string
          user_id: string
          nom: string
          prenom: string
          telephone: string
          adresse: string
          ville: string
          code_postal: string
          pays: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          prenom: string
          telephone: string
          adresse: string
          ville: string
          code_postal: string
          pays?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          prenom?: string
          telephone?: string
          adresse?: string
          ville?: string
          code_postal?: string
          pays?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client typé pour Supabase
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey)

