import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Récupérer les équidés d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "User ID requis" },
        { status: 400 }
      );
    }

    // D'abord récupérer le profil propriétaire
    const { data: proprioProfile, error: proprioError } = await supabase
      .from('proprio_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (proprioError || !proprioProfile) {
      return NextResponse.json(
        { message: "Profil propriétaire non trouvé" },
        { status: 404 }
      );
    }

    const { data: equides, error } = await supabase
      .from('equides')
      .select('*')
      .eq('proprio_id', proprioProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur récupération équidés:", error);
      return NextResponse.json(
        { message: "Erreur lors de la récupération des équidés" },
        { status: 500 }
      );
    }

    return NextResponse.json({ equides });

  } catch (error) {
    console.error("Erreur API équidés:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel équidé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Données reçues par l'API:", body);
    
    // PAS DE VALIDATION - ON AJOUTE DIRECTEMENT

    // Calcul de l'âge simple
    let age = 0;
    if (body.dateNaissance) {
      const birthDate = new Date(body.dateNaissance);
      if (!isNaN(birthDate.getTime())) {
        age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 0) age = 0;
      }
    }

    // Le sexe est déjà dans le bon format (male/female)
    const sexe = body.sexe;

    // D'abord récupérer le profil propriétaire
    const { data: proprioProfile, error: proprioError } = await supabase
      .from('proprio_profiles')
      .select('id')
      .eq('user_id', body.userId)
      .single();

    if (proprioError || !proprioProfile) {
      return NextResponse.json(
        { message: "Profil propriétaire non trouvé" },
        { status: 404 }
      );
    }

    const equideData = {
      proprio_id: proprioProfile.id,
      nom: body.nom || "Équidé",
      age: age,
      race: body.race || "Race",
      couleur: body.couleur || "Couleur",
      sexe: sexe,
      taille: parseFloat(body.taille) || 0,
      poids: parseFloat(body.poids) || 0,
      date_naissance: body.dateNaissance || "2020-01-01",
      proprietaire: body.proprietaire || "Propriétaire",
      veterinaire: body.veterinaire || null,
      notes: body.notes || null
    };

    console.log("Données à insérer:", equideData);

    const { data: equide, error } = await supabase
      .from('equides')
      .insert(equideData)
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { message: `Erreur: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Équidé créé avec succès:", equide);
    return NextResponse.json({ 
      message: "Équidé créé avec succès",
      equide 
    });

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Modifier un équidé
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("PUT - Données reçues:", body);
    
    const { 
      id,
      nom, 
      age, 
      race, 
      couleur, 
      sexe, 
      taille, 
      poids, 
      dateNaissance, 
      proprietaire, 
      veterinaire, 
      notes 
    } = body;

    if (!id) {
      console.log("PUT - Erreur: ID manquant");
      return NextResponse.json(
        { message: "ID de l'équidé requis" },
        { status: 400 }
      );
    }

    console.log("PUT - ID de l'équidé:", id);

    // Le sexe est déjà dans le bon format (male/female)
    const sexeConverti = sexe;

    // Calcul de l'âge pour la modification
    let ageCalcule = 0;
    if (dateNaissance) {
      const birthDate = new Date(dateNaissance);
      if (!isNaN(birthDate.getTime())) {
        ageCalcule = new Date().getFullYear() - birthDate.getFullYear();
        if (ageCalcule < 0) ageCalcule = 0;
      }
    }

    const { data: equide, error } = await supabase
      .from('equides')
      .update({
        nom,
        age: ageCalcule,
        race,
        couleur,
        sexe: sexeConverti,
        taille: parseFloat(taille),
        poids: parseFloat(poids),
        date_naissance: dateNaissance,
        proprietaire: proprietaire || "Propriétaire",
        veterinaire: veterinaire || null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erreur modification équidé:", error);
      console.error("Données envoyées:", body);
      console.error("ID de l'équidé:", id);
      return NextResponse.json(
        { message: `Erreur lors de la modification de l'équidé: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Équidé modifié avec succès",
      equide 
    });

  } catch (error) {
    console.error("Erreur API modification équidé:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un équidé
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: "ID de l'équidé requis" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('equides')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur suppression équidé:", error);
      return NextResponse.json(
        { message: "Erreur lors de la suppression de l'équidé" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Équidé supprimé avec succès" 
    });

  } catch (error) {
    console.error("Erreur API suppression équidé:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
