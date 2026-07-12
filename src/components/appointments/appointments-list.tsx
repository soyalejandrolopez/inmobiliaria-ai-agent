"use client";

import { useRouter } from "next/navigation";
import { Appointment } from "@/generated/prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AppointmentsList({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const router = useRouter();

  async function cancelAppointment(id: string) {
    if (!confirm("¿Cancelar esta cita?")) return;
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    router.refresh();
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-zinc-500">
          No hay citas agendadas. El agente de IA puede agendar citas automáticamente.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-zinc-900">
                  {appointment.startTime.toLocaleString("es-MX", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-zinc-500">
                  {appointment.type === "visit" ? "Visita presencial" : appointment.type === "call" ? "Llamada" : "Videollamada"}
                </p>
                {appointment.aiConfirmed && (
                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Confirmado por IA
                  </span>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    appointment.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status}
                </span>
                {appointment.status !== "CANCELLED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelAppointment(appointment.id)}
                    className="mt-2 block text-red-600"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
