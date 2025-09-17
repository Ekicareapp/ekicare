import Image from "next/image";
import Link from "next/link";

export default function FeaturesShowcase() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Titre + sous-titre */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B263B]">Réservez simplement.</h2>
          <p className="text-[#1B263B]/70 mt-3 max-w-2xl mx-auto">
            Trouvez un professionnel, envoyez votre demande et suivez la réponse en toute simplicité.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Grand visuel */}
          <div className="overflow-hidden rounded-2xl border border-[#1B263B]/10">
            <Image
              src="/hero-stable.jpg"
              alt="Propriétaire et cheval dans une écurie"
              width={1200}
              height={800}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* Carte : prise de RDV */}
          <div className="rounded-2xl border border-[#1B263B]/10 bg-[#EDF2FB] p-6 md:p-8">
            <div className="mb-3">
              {/* icône éclair */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="#F86F4D" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#1B263B]">
              Prise de rendez-vous instantanée
            </h3>
            <p className="mt-2 text-sm text-[#1B263B]/70">Réservez en ligne, 24h/24.</p>
          </div>

          {/* Carte : trouvez le bon pro */}
          <div className="rounded-2xl border border-[#1B263B]/10 bg-[#FAF6F2] p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#1B263B]">
              Trouvez le bon professionnel
            </h3>
            <p className="mt-3 text-sm text-[#1B263B]/70 max-w-lg">
              Accédez à des professionnels qualifiés et vérifiés. Chaque profil est contrôlé pour garantir
              l’expertise et la fiabilité.
            </p>
          </div>

          {/* Carte : disponibilités + CTA */}
          <div className="rounded-2xl border border-[#1B263B]/10 bg-[#FFF3EE] p-6 md:p-8">
            <div className="mb-3">
              {/* icône calendrier */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="#F86F4D" strokeWidth="2"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="#F86F4D" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#1B263B]">
              Disponibilité en temps réel
            </h3>
            <p className="mt-2 text-sm text-[#1B263B]/70">
              Voyez instantanément les créneaux proposés.
            </p>

            <Link
              href="/onboarding?role=proprio"
              className="mt-6 inline-block rounded-full bg-[#F86F4D] px-5 py-3 text-white text-sm font-medium hover:opacity-90"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
