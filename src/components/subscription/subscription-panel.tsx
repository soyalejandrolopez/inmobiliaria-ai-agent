"use client";

import { useState } from "react";
import { Subscription } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubscriptionPanel({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const body = await res.json();
    setLoading(false);

    if (body.url) {
      window.location.href = body.url;
    } else {
      alert(body.error || "Error al iniciar pago");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan actual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <p className="text-2xl font-bold text-zinc-900">{subscription.plan}</p>
            <p className="text-sm text-zinc-500">Estado: {subscription.status}</p>
            {subscription.currentPeriodEnd && (
              <p className="text-sm text-zinc-500">
                Renovación: {subscription.currentPeriodEnd.toLocaleDateString("es-MX")}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-zinc-900">Plan gratuito</p>
            <p className="text-sm text-zinc-500">
              Actualiza para desbloquear minutos de llamadas IA y propiedades ilimitadas.
            </p>
            <Button onClick={startCheckout} disabled={loading}>
              {loading ? "Cargando..." : "Suscribirse ahora"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
