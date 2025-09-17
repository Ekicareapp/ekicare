"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (ville: string, metier: string) => void }) {
  const [ville, setVille] = useState("");
  const [metier, setMetier] = useState("");

  return (
    <form
      aria-label="Recherche de professionnels"
      className="grid gap-3 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(ville, metier);
      }}
    >
      <label className="sr-only" htmlFor="ville">Ville / Code postal</label>
      <input
        id="ville"
        placeholder="Ville / Code postal"
        className="rounded-xl border border-[#1B263B]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#F86F4D]"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
      />

      <label className="sr-only" htmlFor="metier">Métier</label>
      <select
        id="metier"
        className="rounded-xl border border-[#1B263B]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#F86F4D]"
        value={metier}
        onChange={(e) => setMetier(e.target.value)}
      >
        <option value="">Métier</option>
        <option value="veterinaire">Vétérinaire</option>
        <option value="osteopathe">Ostéopathe équin</option>
        <option value="marechal">Maréchal-ferrant</option>
      </select>

      <button className="rounded-xl bg-[#F86F4D] px-5 py-2 text-white">Rechercher</button>
    </form>
  );
}


