import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, Users, Calendar, Phone } from "lucide-react";

async function getStats(userId: string) {
  const [properties, leads, appointments, calls] = await Promise.all([
    prisma.property.count({ where: { agentId: userId } }),
    prisma.lead.count({ where: { agentId: userId } }),
    prisma.appointment.count({ where: { agentId: userId } }),
    prisma.voiceCall.count({ where: { agentId: userId } }),
  ]);

  const totalValue = await prisma.property.aggregate({
    where: { agentId: userId, status: { in: ["FOR_SALE", "FOR_RENT"] } },
    _sum: { price: true },
  });

  return { properties, leads, appointments, calls, totalValue: totalValue._sum.price || 0 };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const stats = await getStats(userId);

  const totalValue = stats.totalValue ? (stats.totalValue as Prisma.Decimal).toNumber() : 0;

  const cards = [
    { label: "Propiedades", value: stats.properties, icon: Home },
    { label: "Leads", value: stats.leads, icon: Users },
    { label: "Citas", value: stats.appointments, icon: Calendar },
    { label: "Llamadas IA", value: stats.calls, icon: Phone },
    { label: "Valor total", value: `$${totalValue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Panel de control</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              Tus leads y citas aparecerán aquí a medida que interactúen con el agente de voz.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agente de voz con IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              El agente puede atender llamadas, calificar leads y agendar citas automáticamente.
              Configura tu proveedor en Configuración.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
