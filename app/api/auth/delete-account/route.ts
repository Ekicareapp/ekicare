import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    console.log("=== SUPPRESSION DE COMPTE ===");
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    // Supprimer le profil selon le rôle
    if (userRole === "PROFESSIONNEL") {
      // Supprimer le profil professionnel
      const { error: proError } = await supabase
        .from('pro_profiles')
        .delete()
        .eq('user_id', userId);

      if (proError) {
        console.error("Erreur suppression profil pro:", proError);
        return NextResponse.json(
          { message: "Erreur lors de la suppression du profil professionnel" },
          { status: 500 }
        );
      }
    } else if (userRole === "PROPRIETAIRE") {
      // Supprimer le profil propriétaire
      const { error: proprioError } = await supabase
        .from('proprio_profiles')
        .delete()
        .eq('user_id', userId);

      if (proprioError) {
        console.error("Erreur suppression profil proprio:", proprioError);
        return NextResponse.json(
          { message: "Erreur lors de la suppression du profil propriétaire" },
          { status: 500 }
        );
      }
    }

    // Supprimer l'utilisateur principal
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (userError) {
      console.error("Erreur suppression utilisateur:", userError);
      return NextResponse.json(
        { message: "Erreur lors de la suppression du compte utilisateur" },
        { status: 500 }
      );
    }

    console.log("✅ Compte supprimé avec succès");

    return NextResponse.json({
      message: "Compte supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

