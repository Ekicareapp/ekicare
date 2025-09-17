import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    console.log("=== RÉINITIALISATION MOT DE PASSE ===");
    console.log("Token:", token);

    // Validation basique
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token et nouveau mot de passe requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // TODO: Vérifier le token dans la base de données
    // Pour l'instant, on simule la vérification
    // Dans un vrai système, on aurait une table password_resets avec les tokens

    // Simuler la récupération de l'utilisateur par token
    // En réalité, on ferait : SELECT user_id FROM password_resets WHERE token = ? AND expires_at > NOW()
    console.log("Token validé (simulation)");

    // Pour la démo, on va chercher un utilisateur au hasard
    // Dans un vrai système, on utiliserait l'user_id du token
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      return NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const userId = users[0].id;

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId);

    if (updateError) {
      console.error("Erreur mise à jour mot de passe:", updateError);
      return NextResponse.json(
        { message: "Erreur lors de la mise à jour du mot de passe" },
        { status: 500 }
      );
    }

    // TODO: Supprimer le token de réinitialisation de la base de données
    // DELETE FROM password_resets WHERE token = ?

    console.log("Mot de passe réinitialisé avec succès pour l'utilisateur:", userId);

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}


