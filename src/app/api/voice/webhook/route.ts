import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeConversation } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const callId = body.call_id || body.id;
    const transcript = body.transcript || body.message?.transcript || "";
    const recordingUrl = body.recording_url || body.recordingUrl || null;
    const durationSeconds = body.duration_seconds || body.durationSeconds || 0;
    const status = body.status || "COMPLETED";

    const voiceCall = await prisma.voiceCall.findUnique({
      where: { externalCallId: callId },
    });

    if (!voiceCall) {
      return NextResponse.json({ received: true });
    }

    const analysis = await analyzeConversation(transcript);

    await prisma.voiceCall.update({
      where: { id: voiceCall.id },
      data: {
        status: status === "completed" ? "COMPLETED" : status.toUpperCase(),
        transcript,
        summary: analysis.summary,
        recordingUrl,
        durationSeconds,
        aiScore: analysis.aiScore,
        endedAt: new Date(),
      },
    });

    if (voiceCall.leadId) {
      await prisma.lead.update({
        where: { id: voiceCall.leadId },
        data: {
          aiScore: analysis.aiScore,
          status: analysis.wantsVisit ? "VISIT_SCHEDULED" : analysis.aiScore >= 70 ? "QUALIFIED" : "CONTACTED",
          lastContactAt: new Date(),
          nextFollowUpAt: analysis.wantsVisit
            ? new Date(Date.now() + 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes: analysis.notes,
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: voiceCall.leadId,
          type: "call",
          content: analysis.summary.slice(0, 500),
        },
      });

      if (analysis.wantsVisit && analysis.suggestedDate) {
        const startTime = new Date(analysis.suggestedDate);
        if (!isNaN(startTime.getTime())) {
          await prisma.appointment.create({
            data: {
              agentId: voiceCall.agentId,
              leadId: voiceCall.leadId,
              propertyId: voiceCall.propertyId,
              startTime,
              endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
              type: "visit",
              aiConfirmed: true,
              notes: analysis.summary,
              status: "CONFIRMED",
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Voice webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
