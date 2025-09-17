import { z } from "zod";

export const simpleOnboardingSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
  role: z.enum(["pro", "proprio"], {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle" })
  }),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(10, "Le numéro de téléphone est requis"),
  ville: z.string().min(1, "La ville est requise"),
  // Champs conditionnels pour proprio
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  pays: z.string().optional(),
  // Champs conditionnels pour pro
  profession: z.string().optional(),
  villeReference: z.string().optional(),
  rayonExercice: z.number().optional(),
  description: z.string().optional(),
  siret: z.string().optional(),
  justificatif: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).superRefine((data, ctx) => {
  if (data.role === "proprio") {
    if (!data.adresse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'adresse est requise pour les propriétaires",
        path: ["adresse"],
      });
    }
    if (!data.codePostal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le code postal est requis pour les propriétaires",
        path: ["codePostal"],
      });
    }
    if (!data.pays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pays est requis pour les propriétaires",
        path: ["pays"],
      });
    }
  } else if (data.role === "pro") {
    if (!data.profession) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La profession est requise pour les professionnels",
        path: ["profession"],
      });
    }
    if (!data.villeReference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La ville de référence d'exercice est requise",
        path: ["villeReference"],
      });
    }
    if (!data.description || data.description.length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La description doit contenir au moins 50 caractères",
        path: ["description"],
      });
    }
    if (!data.siret || !/^\d{14}$/.test(data.siret)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le numéro SIRET doit contenir exactement 14 chiffres",
        path: ["siret"],
      });
    }
    if (!data.justificatif) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le justificatif de profession est requis",
        path: ["justificatif"],
      });
    }
  }
});

export type SimpleOnboardingData = z.infer<typeof simpleOnboardingSchema>;
