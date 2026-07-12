"use client";

import { VoiceCall } from "@/generated/prisma/client";
import { Card, CardContent } from "@/components/ui/card";

export function VoiceCallsList({
  calls,
}: {
  calls: VoiceCall[];
}) {
  if (calls.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-zinc-500">
          No hay llamadas registradas. El agente de IA registrará cada interacción aquí.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <Card key={call.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-zinc-900">{call.status}</p>
                <p className="text-sm text-zinc-500">
                  {call.startedAt
                    ? call.startedAt.toLocaleString("es-MX")
                    : call.createdAt.toLocaleString("es-MX")}
                </p>
                {call.durationSeconds && (
                  <p className="text-sm text-zinc-500">{call.durationSeconds}s</p>
                )}
                {call.aiScore !== null && call.aiScore !== undefined && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      call.aiScore >= 70
                        ? "bg-green-100 text-green-700"
                        : call.aiScore >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    IA {call.aiScore}%
                  </span>
                )}
              </div>
            </div>
            {call.summary && (
              <p className="mt-3 text-sm text-zinc-700">{call.summary}</p>
            )}
            {call.transcript && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-zinc-500">
                  Ver transcripción
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                  {call.transcript}
                </p>
              </details>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
