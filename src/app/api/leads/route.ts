import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().default("web"),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "VISIT_SCHEDULED", "OFFER_MADE", "CLOSED_WON", "CLOSED_LOST", "NURTURING"]).default("NEW"),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  preferredType: z.enum(["APARTMENT", "HOUSE", "OFFICE", "COMMERCIAL", "LAND", "INDUSTRIAL"]).optional(),
  preferredCity: z.string().optional(),
  notes: z.string().optional(),
  aiScore: z.coerce.number().min(0).max(100).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { appointments: true, voiceCalls: true } } },
  });

  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        agentId: session.user.id,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear lead" }, { status: 500 });
  }
}
