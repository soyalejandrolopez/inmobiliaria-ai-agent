import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const appointmentSchema = z.object({
  leadId: z.string(),
  propertyId: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  type: z.enum(["visit", "call", "video"]).default("visit"),
  notes: z.string().optional(),
  aiConfirmed: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { agentId: session.user.id },
    orderBy: { startTime: "desc" },
    include: { lead: { select: { name: true, email: true, phone: true } }, property: { select: { title: true, address: true } } },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    const appointment = await prisma.appointment.create({
      data: {
        ...parsed.data,
        agentId: session.user.id,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}
