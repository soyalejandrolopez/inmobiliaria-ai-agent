import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getVoiceProvider } from "@/lib/voice/voice-provider";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const { leadId, propertyId, message } = body;

    const lead = await prisma.lead.findFirst({
      where: { id: leadId, agentId: session.user.id },
    });

    if (!lead || !lead.phone) {
      return NextResponse.json({ error: "Lead no encontrado o sin teléfono" }, { status: 400 });
    }

    const provider = getVoiceProvider();
    const result = await provider.makeCall({
      toNumber: lead.phone,
      leadId: lead.id,
      propertyId,
      message,
    });

    await prisma.voiceCall.create({
      data: {
        agentId: session.user.id,
        leadId: lead.id,
        propertyId,
        externalCallId: result.callId,
        status: "SCHEDULED",
        direction: "outbound",
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Voice call error:", error);
    return NextResponse.json({ error: (error as Error).message || "Error al iniciar llamada" }, { status: 500 });
  }
}
