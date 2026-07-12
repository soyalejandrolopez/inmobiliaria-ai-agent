"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VoiceCallPanel({
  leads,
}: {
  leads: { id: string; name: string; phone: string | null }[];
}) {
  const router = useRouter();
  const [leadId, setLeadId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function startCall() {
    if (!leadId) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/voice/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, message }),
    });

    const body = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult("Llamada iniciada correctamente. ID: " + body.callId);
      router.refresh();
    } else {
      setResult("Error: " + (body.error || "No se pudo iniciar la llamada"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar llamada IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Lead</label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Seleccionar lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} {l.phone ? `(${l.phone})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensaje inicial (opcional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            placeholder="Hola, soy tu asistente inmobiliario..."
          />
        </div>
        <Button onClick={startCall} disabled={loading || !leadId} className="w-full">
          {loading ? "Llamando..." : "Llamar con IA"}
        </Button>
        {result && <p className="text-sm text-zinc-600">{result}</p>}
        <p className="text-xs text-zinc-500">
          Requiere configurar VOICE_PROVIDER_API_KEY en las variables de entorno.
        </p>
      </CardContent>
    </Card>
  );
}
