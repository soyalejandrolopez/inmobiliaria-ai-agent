"use client";

import { useRouter } from "next/navigation";
import { Property } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PropertiesList({ properties }: { properties: Property[] }) {
  const router = useRouter();

  async function deleteProperty(id: string) {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-zinc-500">
          No tienes propiedades registradas. Crea una usando el formulario.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle className="text-base">{property.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              {property.address}, {property.city}
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">
              ${property.price.toNumber().toLocaleString()} {property.currency}
            </p>
            <p className="text-xs text-zinc-500">{property.status}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteProperty(property.id)}
              >
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
