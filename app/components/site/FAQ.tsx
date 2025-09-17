"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-[#1B263B]/10 bg-white shadow-sm">
      <button
        className="w-full px-4 py-3 sm:px-6 sm:py-4 text-left flex items-center justify-between focus:outline-none"
        onClick={onClick}
      >
        <h3 className="text-base sm:text-lg font-semibold text-[#1B263B] pr-3 sm:pr-4">
          {question}
        </h3>
        <svg
          className={`h-4 w-4 sm:h-5 sm:w-5 text-[#1B263B] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-3 sm:px-6 sm:pb-4">
          <p className="text-sm sm:text-base text-[#1B263B]/70 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData = [
    {
      id: "1",
      question: "Est-ce que l'inscription sur Ekicare est vraiment gratuite ?",
      answer: "Oui, l'inscription est 100 % gratuite, aussi bien pour les professionnels que pour les propriétaires. Aucun engagement, aucun abonnement caché."
    },
    {
      id: "2",
      question: "Comment êtes-vous sûrs que les professionnels sont qualifiés ?",
      answer: "Chaque profil est vérifié manuellement. Nous demandons un justificatif d'activité avant toute mise en ligne, pour garantir fiabilité et sécurité."
    },
    {
      id: "3",
      question: "Est-ce que je dois télécharger une application ?",
      answer: "Non, Ekicare fonctionne directement depuis votre navigateur, sur ordinateur comme sur smartphone. Rien à installer."
    },
    {
      id: "4",
      question: "Comment prendre rendez-vous avec un professionnel ?",
      answer: "C'est simple : choisissez un professionnel, consultez ses créneaux disponibles, puis réservez en ligne en quelques clics."
    },
    {
      id: "5",
      question: "Que faire si je ne trouve aucun professionnel près de chez moi ?",
      answer: "Nous développons notre réseau chaque jour. Vous pouvez aussi nous écrire via le formulaire de contact pour que nous vous aidions à trouver un pro."
    }
  ];

  return (
    <motion.section 
      id="faq" 
      className="py-12 sm:py-16 lg:py-20 bg-[#FAF6F2]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B263B]">
            Questions fréquentes
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-[#1B263B]/70 px-2">
            Retrouvez les réponses aux questions les plus courantes
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 space-y-2 sm:space-y-3">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <FAQItem
                id={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openItems.includes(item.id)}
                onClick={() => toggleItem(item.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-[#1B263B]/70 mb-6">
            Vous avez d'autres questions ?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center rounded-md bg-[#F86F4D] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#F86F4D]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F86F4D]"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </motion.section>
  );
}