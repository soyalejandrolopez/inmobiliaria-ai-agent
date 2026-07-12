import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SubscriptionPanel } from "@/components/subscription/subscription-panel";

export default async function SubscriptionPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Suscripción</h1>
      <SubscriptionPanel subscription={subscription} />
    </div>
  );
}
