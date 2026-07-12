import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const profile = await prisma.agentProfile.findUnique({
    where: { userId },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Configuración</h1>
      <SettingsForm profile={profile} />
    </div>
  );
}
