import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: user.name || undefined,
    });
    customerId = customer.id;
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price no configurado" }, { status: 500 });
  }

  const checkout = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/suscripcion?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/suscripcion?canceled=1`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkout.url });
}
