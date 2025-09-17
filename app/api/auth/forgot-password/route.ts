import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log("=== MOT DE PASSE OUBLIÉ ===");
    console.log("Email:", email);

    // Validation basique
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.log("Utilisateur non trouvé:", email);
      // On ne révèle pas si l'email existe ou non pour des raisons de sécurité
      return NextResponse.json({
        message: "Si cette adresse email existe dans notre système, vous recevrez un email de réinitialisation."
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 heure

    // Stocker le token dans la base de données (on pourrait créer une table password_resets)
    // Pour l'instant, on simule l'envoi d'email
    console.log("Token généré pour:", email);
    console.log("Token:", resetToken);
    console.log("Expire le:", resetExpires);

    // TODO: Ici on enverrait un vrai email avec le lien de réinitialisation
    // const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendResetEmail(email, resetLink);

    // Pour la démo, on affiche le token dans la console
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    console.log("=== LIEN DE RÉINITIALISATION ===");
    console.log(`Lien: ${resetLink}`);

    return NextResponse.json({
      message: `✅ Lien de réinitialisation généré ! Pour la démo, voici le lien : ${resetLink}`,
      resetLink: resetLink
    });

  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
