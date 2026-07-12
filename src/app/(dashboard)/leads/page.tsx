import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { LeadsList } from "@/components/leads/leads-list";
import { LeadForm } from "@/components/leads/lead-form";

export default async function LeadsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const leads = await prisma.lead.findMany({
    where: { agentId: userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { appointments: true, voiceCalls: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Leads y CRM</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LeadForm />
        </div>
        <div className="lg:col-span-2">
          <LeadsList leads={leads} />
        </div>
      </div>
    </div>
  );
}
