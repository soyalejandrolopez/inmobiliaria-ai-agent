import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { VoiceCallPanel } from "@/components/voice/voice-call-panel";
import { VoiceCallsList } from "@/components/voice/voice-calls-list";

export default async function VoiceCallsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const [calls, leads] = await Promise.all([
    prisma.voiceCall.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: "desc" },
      include: { lead: { select: { name: true, phone: true } }, property: { select: { title: true } } },
    }),
    prisma.lead.findMany({ where: { agentId: userId }, select: { id: true, name: true, phone: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Agente de voz con IA</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <VoiceCallPanel leads={leads} />
        </div>
        <div className="lg:col-span-2">
          <VoiceCallsList calls={calls} />
        </div>
      </div>
    </div>
  );
}
