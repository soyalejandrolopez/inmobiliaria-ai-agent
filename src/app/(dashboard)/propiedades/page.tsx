import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PropertiesList } from "@/components/properties/properties-list";
import { PropertyForm } from "@/components/properties/property-form";

export default async function PropertiesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const properties = await prisma.property.findMany({
    where: { agentId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Propiedades</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PropertyForm />
        </div>
        <div className="lg:col-span-2">
          <PropertiesList properties={properties} />
        </div>
      </div>
    </div>
  );
}
