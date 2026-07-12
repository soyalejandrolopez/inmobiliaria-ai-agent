import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  type: z.enum(["APARTMENT", "HOUSE", "OFFICE", "COMMERCIAL", "LAND", "INDUSTRIAL"]).optional(),
  status: z.enum(["FOR_SALE", "FOR_RENT", "SOLD", "RENTED", "RESERVED"]).optional(),
  price: z.coerce.number().positive().optional(),
  currency: z.string().optional(),
  address: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  sqm: z.coerce.number().optional(),
  lotSize: z.coerce.number().optional(),
  yearBuilt: z.coerce.number().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, agentId: session.user.id },
  });

  if (!property) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(property);
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
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const property = await prisma.property.updateMany({
      where: { id, agentId: session.user.id },
      data: parsed.data,
    });

    if (property.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

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
  const deleted = await prisma.property.deleteMany({
    where: { id, agentId: session.user.id },
  });

  if (deleted.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ success: true });
}
