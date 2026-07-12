"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentProfile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForm({ profile }: { profile: AgentProfile | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/agent/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        isAvailable: data.isAvailable === "on",
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error al guardar");
      return;
    }

    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil del agente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agencia</Label>
            <Input id="agencyName" name="agencyName" defaultValue={profile?.agencyName || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Cédula / Licencia</Label>
            <Input id="license" name="license" defaultValue={profile?.license || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Sitio web</Label>
            <Input id="website" name="website" defaultValue={profile?.website || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona horaria</Label>
            <Input id="timezone" name="timezone" defaultValue={profile?.timezone || "America/Mexico_City"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ""}
              className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              defaultChecked={profile?.isAvailable ?? true}
            />
            <Label htmlFor="isAvailable">Disponible para citas</Label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
