"use client";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Créez votre compte",
      description:
        "Inscrivez-vous gratuitement en tant que propriétaire et accédez à votre espace personnel.",
    },
    {
      number: 2,
      title: "Recherchez un professionnel",
      description:
        "Trouvez un vétérinaire, un ostéopathe équin ou un maréchal-ferrant près de chez vous.",
    },
    {
      number: 3,
      title: "Demandez un rendez-vous",
      description:
        "Sélectionnez un créneau, envoyez votre demande et recevez la réponse du professionnel.",
    },
  ];

  return (
    <section className="bg-[#FAF6F2]">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14 text-[#1B263B]">
          Comment ça marche ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#1B263B]/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#F86F4D] text-white grid place-items-center font-semibold">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#1B263B]">{step.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#1B263B]/80">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 flex justify-center">
          <Link
            href="/onboarding?role=proprio"
            className="rounded-xl bg-[#F86F4D] px-5 py-3 text-white font-medium hover:opacity-90 transition"
          >
            Commencer maintenant
          </Link>
        </div>
      </div>
    </section>
  );
}
