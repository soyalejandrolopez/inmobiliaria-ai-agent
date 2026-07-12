"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentForm({
  leads,
  properties,
}: {
  leads: { id: string; name: string }[];
  properties: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const startTime = new Date(`${data.date}T${data.startTime}`);
    const endTime = new Date(`${data.date}T${data.endTime}`);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: data.leadId,
        propertyId: data.propertyId || undefined,
        startTime,
        endTime,
        type: data.type,
        notes: data.notes,
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
        <CardTitle>Agendar cita</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leadId">Lead</Label>
            <select
              id="leadId"
              name="leadId"
              required
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Seleccionar lead</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyId">Propiedad (opcional)</Label>
            <select
              id="propertyId"
              name="propertyId"
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Ninguna</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="visit">Visita presencial</option>
              <option value="call">Llamada</option>
              <option value="video">Videollamada</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Inicio</Label>
              <Input id="startTime" name="startTime" type="time" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input id="endTime" name="endTime" type="time" required />
            </div>
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
            {loading ? "Agendando..." : "Agendar cita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
