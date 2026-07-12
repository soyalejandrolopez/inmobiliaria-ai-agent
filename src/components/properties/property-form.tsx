"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const propertyTypes = [
  { value: "APARTMENT", label: "Departamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "OFFICE", label: "Oficina" },
  { value: "COMMERCIAL", label: "Local comercial" },
  { value: "LAND", label: "Terreno" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

const statuses = [
  { value: "FOR_SALE", label: "En venta" },
  { value: "FOR_RENT", label: "En renta" },
  { value: "SOLD", label: "Vendido" },
  { value: "RENTED", label: "Rentado" },
  { value: "RESERVED", label: "Reservado" },
];

export function PropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        price: Number(data.price),
        bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
        sqm: data.sqm ? Number(data.sqm) : undefined,
        yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
        features: data.features ? (data.features as string).split(",").map((f) => f.trim()) : [],
        images: data.images ? (data.images as string).split(",").map((i) => i.trim()) : [],
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
        <CardTitle>Nueva propiedad</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                required
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                required
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Input id="currency" name="currency" defaultValue="USD" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado/Provincia</Label>
              <Input id="state" name="state" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Recámaras</Label>
              <Input id="bedrooms" name="bedrooms" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input id="bathrooms" name="bathrooms" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sqm">m²</Label>
              <Input id="sqm" name="sqm" type="number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Imágenes (URLs separadas por coma)</Label>
            <Input id="images" name="images" placeholder="https://..." />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar propiedad"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
