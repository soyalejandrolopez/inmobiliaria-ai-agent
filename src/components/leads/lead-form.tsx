"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statuses = [
  { value: "NEW", label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUALIFIED", label: "Calificado" },
  { value: "VISIT_SCHEDULED", label: "Visita agendada" },
  { value: "OFFER_MADE", label: "Oferta hecha" },
  { value: "CLOSED_WON", label: "Ganado" },
  { value: "CLOSED_LOST", label: "Perdido" },
  { value: "NURTURING", label: "En nutrición" },
];

const types = [
  { value: "APARTMENT", label: "Departamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "OFFICE", label: "Oficina" },
  { value: "COMMERCIAL", label: "Local comercial" },
  { value: "LAND", label: "Terreno" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

export function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
        aiScore: data.aiScore ? Number(data.aiScore) : undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error al guardar");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredType">Tipo preferido</Label>
              <select
                id="preferredType"
                name="preferredType"
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Ninguno</option>
                {types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Presupuesto mín</Label>
              <Input id="budgetMin" name="budgetMin" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Presupuesto máx</Label>
              <Input id="budgetMax" name="budgetMax" type="number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredCity">Ciudad preferida</Label>
            <Input id="preferredCity" name="preferredCity" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar lead"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
