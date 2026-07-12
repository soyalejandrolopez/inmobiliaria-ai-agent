import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  phone: z.string().optional(),
  bio: z.string().optional(),
  agencyName: z.string().optional(),
  license: z.string().optional(),
  website: z.string().optional(),
  timezone: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    await prisma.agentProfile.upsert({
      where: { userId: session.user.id },
      create: { ...parsed.data, userId: session.user.id },
      update: parsed.data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
