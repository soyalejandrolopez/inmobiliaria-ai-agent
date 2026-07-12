import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { AppointmentsList } from "@/components/appointments/appointments-list";

export default async function AppointmentsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const [appointments, leads, properties] = await Promise.all([
    prisma.appointment.findMany({
      where: { agentId: userId },
      orderBy: { startTime: "desc" },
      include: { lead: { select: { name: true } }, property: { select: { title: true } } },
    }),
    prisma.lead.findMany({ where: { agentId: userId }, select: { id: true, name: true } }),
    prisma.property.findMany({ where: { agentId: userId }, select: { id: true, title: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Citas y reservas</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AppointmentForm leads={leads} properties={properties} />
        </div>
        <div className="lg:col-span-2">
          <AppointmentsList appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
