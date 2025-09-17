"use client";

import type { Demande } from "@/lib/types";
import StatusBadge from "@/app/components/ui/StatusBadge";
import DateTime from "@/app/components/ui/DateTime";

type Props = {
  rows: Demande[];
  role: "pro" | "proprio";
  onAccept?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
};

export default function RequestTable({
  rows,
  role,
  onAccept,
  onReschedule,
  onDecline,
  onCancel,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1B263B]/15 bg-white">
      {/* Desktop table */}
      <div className="hidden min-w-full md:block">
        <table className="min-w-full divide-y divide-[#1B263B]/10">
          <thead className="bg-[#FAF6F2]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#1B263B]">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#1B263B]">
                {role === "pro" ? "Propriétaire" : "Professionnel"}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#1B263B]">Ville</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#1B263B]">Cheval</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#1B263B]">Statut</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[#1B263B]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B263B]/10">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF6F2]/60">
                <td className="px-4 py-3 text-sm text-[#1B263B]">
                  <DateTime iso={r.start_at} />
                </td>
                <td className="px-4 py-3 text-sm text-[#1B263B]">
                  {role === "pro" ? r.proprio.nom : `${r.pro.nom} (${r.pro.metier})`}
                </td>
                <td className="px-4 py-3 text-sm text-[#1B263B]">{r.pro.ville}</td>
                <td className="px-4 py-3 text-sm text-[#1B263B]">{r.cheval?.nom ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-[#1B263B]">
                  <StatusBadge statut={r.statut} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions
                    role={role}
                    statut={r.statut}
                    id={r.id}
                    onAccept={onAccept}
                    onReschedule={onReschedule}
                    onDecline={onDecline}
                    onCancel={onCancel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[#1B263B]/10">
        {rows.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-[#1B263B]">
                <DateTime iso={r.start_at} />
              </div>
              <StatusBadge statut={r.statut} />
            </div>
            <div className="mt-1 text-sm text-[#1B263B]/80">
              {role === "pro" ? r.proprio.nom : `${r.pro.nom} (${r.pro.metier})`} · {r.pro.ville}
            </div>
            <div className="mt-1 text-sm text-[#1B263B]/80">Cheval : {r.cheval?.nom ?? "—"}</div>
            <div className="mt-3">
              <RowActions
                role={role}
                statut={r.statut}
                id={r.id}
                onAccept={onAccept}
                onReschedule={onReschedule}
                onDecline={onDecline}
                onCancel={onCancel}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RowActions({
  role,
  statut,
  id,
  onAccept,
  onReschedule,
  onDecline,
  onCancel,
}: {
  role: "pro" | "proprio";
  statut: Demande["statut"];
  id: string;
  onAccept?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  const Btn = ({
    children,
    onClick,
    variant = "primary" as const,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "ghost" | "danger";
  }) => (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        variant === "primary"
          ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
          : variant === "danger"
          ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
          : "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
      }`}
    >
      {children}
    </button>
  );

  if (role === "pro") {
    return (
      <div className="flex items-center justify-end gap-2">
        {statut === "pending" ? (
          <>
            <Btn onClick={() => onAccept?.(id)}>Accepter</Btn>
            <Btn variant="ghost" onClick={() => onReschedule?.(id)}>Proposer un autre horaire</Btn>
            <Btn variant="danger" onClick={() => onDecline?.(id)}>Refuser</Btn>
          </>
        ) : (
          <span className="text-sm text-[#1B263B]/60">—</span>
        )}
      </div>
    );
  }

  // proprio
  return (
    <div className="flex items-center justify-end gap-2">
      {statut === "pending" ? (
        <Btn variant="danger" onClick={() => onCancel?.(id)}>Annuler</Btn>
      ) : (
        <span className="text-sm text-[#1B263B]/60">—</span>
      )}
    </div>
  );
}
