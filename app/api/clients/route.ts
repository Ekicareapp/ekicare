import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/clients - Récupérer les clients d'un professionnel
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un professionnel
    if (session.user.role !== 'PROFESSIONNEL') {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer le profil professionnel
    const { data: proProfile, error: proError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (proError || !proProfile) {
      return NextResponse.json({ error: "Profil professionnel non trouvé" }, { status: 404 });
    }

    // Récupérer les clients uniques du professionnel via les rendez-vous
    const { data: rendezVous, error: rdvError } = await supabase
      .from('rendez_vous')
      .select(`
        client_id,
        client:proprio_profiles(
          id,
          nom,
          prenom,
          telephone,
          email,
          adresse,
          ville,
          code_postal
        )
      `)
      .eq('pro_id', proProfile.id)
      .not('client_id', 'is', null);

    if (rdvError) {
      console.error("Erreur lors de la récupération des clients:", rdvError);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    // Dédupliquer les clients
    const clientsUniques = new Map();
    rendezVous.forEach(rdv => {
      if (rdv.client && rdv.client_id) {
        clientsUniques.set(rdv.client_id, {
          id: rdv.client.id,
          nom: rdv.client.nom,
          prenom: rdv.client.prenom,
          telephone: rdv.client.telephone,
          email: rdv.client.email || '',
          adresse: rdv.client.adresse || '',
          ville: rdv.client.ville || '',
          codePostal: rdv.client.code_postal || ''
        });
      }
    });

    const clients = Array.from(clientsUniques.values());

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer un client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { nom, prenom, telephone, email, adresse, ville, codePostal } = body;

    // Validation des données
    if (!nom || !prenom || !telephone) {
      return NextResponse.json({ error: "Nom, prénom et téléphone sont requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est un professionnel
    if (session.user.role !== 'PROFESSIONNEL') {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer le profil professionnel
    const { data: proProfile, error: proError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (proError || !proProfile) {
      return NextResponse.json({ error: "Profil professionnel non trouvé" }, { status: 404 });
    }

    // Créer le client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        pro_id: proProfile.id,
        nom,
        prenom,
        telephone,
        email: email || '',
        adresse: adresse || '',
        ville: ville || '',
        code_postal: codePostal || ''
      })
      .select()
      .single();

    if (clientError) {
      console.error("Erreur lors de la création du client:", clientError);
      return NextResponse.json({ error: "Erreur lors de la création du client" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      client,
      message: "Client créé avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}