"use client";

import { useRouter } from "next/navigation";
import { Lead } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LeadWithCount = Lead & {
  _count: { appointments: number; voiceCalls: number };
};

export function LeadsList({ leads }: { leads: LeadWithCount[] }) {
  const router = useRouter();

  async function deleteLead(id: string) {
    if (!confirm("¿Eliminar este lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-zinc-500">
          No tienes leads registrados. El agente de voz los generará automáticamente.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{lead.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">{lead.email}</p>
            {lead.phone && <p className="text-sm text-zinc-500">{lead.phone}</p>}
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                {lead.status}
              </span>
              {lead.aiScore !== null && lead.aiScore !== undefined && (
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    lead.aiScore >= 70
                      ? "bg-green-100 text-green-700"
                      : lead.aiScore >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  IA {lead.aiScore}%
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                Ver
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteLead(lead.id)}>
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
