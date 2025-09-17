import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Format de fichier non supporté. Utilisez JPG, PNG ou WEBP" },
        { status: 400 }
      );
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Le fichier ne doit pas dépasser 5MB" },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Chemin de destination
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    const filePath = join(uploadDir, fileName);
    
    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);
    
    // Retourner l'URL du fichier
    const fileUrl = `/uploads/profiles/${fileName}`;
    
    return NextResponse.json({
      message: "Photo uploadée avec succès",
      url: fileUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'upload de la photo" },
      { status: 500 }
    );
  }
}

