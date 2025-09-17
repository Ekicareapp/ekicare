"use client";
import { useState } from "react";

type Item = { q: string; a: string };

const items: Item[] = [
  {
    q: "Est-ce que l’inscription sur Ekicare est vraiment gratuite ?",
    a: "Oui, l’inscription est 100 % gratuite pour les professionnels comme pour les propriétaires. Aucun engagement, aucun abonnement caché.",
  },
  {
    q: "Comment êtes-vous sûrs que les professionnels sont qualifiés ?",
    a: "Chaque profil est vérifié manuellement. Nous demandons un justificatif d’activité avant toute mise en ligne, pour garantir fiabilité et sécurité.",
  },
  {
    q: "Est-ce que je dois télécharger une application ?",
    a: "Non, Ekicare fonctionne directement dans votre navigateur, sur ordinateur comme sur smartphone. Rien à installer.",
  },
  {
    q: "Comment prendre rendez-vous avec un professionnel ?",
    a: "Choisissez un professionnel, consultez ses créneaux, puis envoyez une demande en quelques clics. Vous serez notifié quand c’est accepté.",
  },
  {
    q: "Que faire si je ne trouve aucun professionnel près de chez moi ?",
    a: "Nous développons le réseau chaque jour. Écrivez-nous via le formulaire de contact pour que l’on vous aide à trouver un pro.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#1B263B]">
          Foire aux questions
        </h2>

        <div className="mt-10 space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-[#F86F4D]/40 bg-white px-4 py-3 md:px-6 md:py-4 shadow-[0_1px_0_rgba(27,38,59,0.05)]"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[#1B263B]">{item.q}</span>
                  <span className="text-[#F86F4D] text-xl leading-none">
                    {isOpen ? "×" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-3 text-sm leading-relaxed text-[#1B263B]/75">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
