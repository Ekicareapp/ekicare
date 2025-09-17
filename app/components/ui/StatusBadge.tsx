import type { DemandeStatut } from "@/lib/types";

const labelMap: Record<DemandeStatut, string> = {
  pending: "En attente",
  accepted: "Accepté",
  rescheduled: "Modifié",
  declined: "Refusé",
  cancelled_by_owner: "Annulé",
};

const classMap: Record<DemandeStatut, string> = {
  pending: "bg-[#1B263B]/5 text-[#1B263B] border-[#1B263B]/20",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rescheduled: "bg-amber-50 text-amber-700 border-amber-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  cancelled_by_owner: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function StatusBadge({ statut }: { statut: DemandeStatut }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classMap[statut]}`}>
      {labelMap[statut]}
    </span>
  );
}


