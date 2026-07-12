import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "VISIT_SCHEDULED", "OFFER_MADE", "CLOSED_WON", "CLOSED_LOST", "NURTURING"]).optional(),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  preferredType: z.enum(["APARTMENT", "HOUSE", "OFFICE", "COMMERCIAL", "LAND", "INDUSTRIAL"]).optional(),
  preferredCity: z.string().optional(),
  notes: z.string().optional(),
  aiScore: z.coerce.number().min(0).max(100).optional(),
  nextFollowUpAt: z.coerce.date().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findFirst({
    where: { id, agentId: session.user.id },
    include: { activities: { orderBy: { createdAt: "desc" } }, appointments: { include: { property: true } }, voiceCalls: true },
  });

  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(lead);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    const updated = await prisma.lead.updateMany({
      where: { id, agentId: session.user.id },
      data: parsed.data,
    });

    if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.lead.deleteMany({ where: { id, agentId: session.user.id } });

  return NextResponse.json({ success: true });
}
