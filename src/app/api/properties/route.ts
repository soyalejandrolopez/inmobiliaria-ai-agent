import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["APARTMENT", "HOUSE", "OFFICE", "COMMERCIAL", "LAND", "INDUSTRIAL"]),
  status: z.enum(["FOR_SALE", "FOR_RENT", "SOLD", "RENTED", "RESERVED"]),
  price: z.coerce.number().positive(),
  currency: z.string().default("USD"),
  address: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().optional(),
  country: z.string().default("México"),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  sqm: z.coerce.number().optional(),
  lotSize: z.coerce.number().optional(),
  yearBuilt: z.coerce.number().optional(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const properties = await prisma.property.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        ...parsed.data,
        price: parsed.data.price,
        agentId: session.user.id,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 500 });
  }
}
