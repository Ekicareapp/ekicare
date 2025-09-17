import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

// Validation simple
function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Données reçues:", body);
    
    // Validation basique
    if (!body.email || !validateEmail(body.email)) {
      return NextResponse.json(
        { message: "Email invalide" },
        { status: 400 }
      );
    }

    if (!body.password || !validatePassword(body.password)) {
      return NextResponse.json(
        { message: "Mot de passe invalide (minimum 8 caractères)" },
        { status: 400 }
      );
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    if (!body.role || !['pro', 'proprio'].includes(body.role)) {
      return NextResponse.json(
        { message: "Rôle invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte avec cette adresse email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Mapper le rôle pour Supabase
    const supabaseRole = body.role === "pro" ? "PROFESSIONNEL" : "PROPRIETAIRE";

    // Créer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: body.email,
        password: hashedPassword,
        role: supabaseRole,
      })
      .select()
      .single();

    if (userError) {
      console.error("Erreur création utilisateur:", userError);
      return NextResponse.json(
        { message: "Erreur lors de la création de l'utilisateur: " + userError.message },
        { status: 500 }
      );
    }

    console.log("Utilisateur créé:", user);

            // Créer le profil selon le rôle
            if (body.role === "pro") {
              console.log("=== CRÉATION PROFIL PROFESSIONNEL ===");
              console.log("body.rayonExercice:", body.rayonExercice);
              console.log("Type:", typeof body.rayonExercice);
              
              const { error: proError } = await supabase
                .from('pro_profiles')
                .insert({
                  user_id: user.id,
                  nom: body.nom,
                  prenom: body.prenom,
                  telephone: body.telephone,
                  profession: body.profession,
                  adresse: body.villeReference,
                  ville: body.villeReference,
                  code_postal: "00000",
                  description: body.description || "",
                  experience: 0,
                  tarif_min: 0,
                  tarif_max: 0,
                  rayon_exercice: parseInt(body.rayonExercice) || 50,
                  siret: body.siret,
                  photo_profil: body.photoProfil || null,
                });

      if (proError) {
        console.error("Erreur création profil pro:", proError);
        return NextResponse.json(
          { message: "Erreur lors de la création du profil professionnel: " + proError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: proprioError } = await supabase
        .from('proprio_profiles')
        .insert({
          user_id: user.id,
          nom: body.nom,
          prenom: body.prenom,
          telephone: body.telephone,
          adresse: body.adresse,
          ville: body.ville,
          code_postal: body.codePostal,
                        pays: "France", // Valeur par défaut
        });

      if (proprioError) {
        console.error("Erreur création profil proprio:", proprioError);
        return NextResponse.json(
          { message: "Erreur lors de la création du profil propriétaire: " + proprioError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Compte créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: `${body.prenom} ${body.nom}`,
        role: body.role
      }
    });

  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
