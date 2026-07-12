import { vapiProvider } from "./vapi";
import { blandProvider } from "./bland";

export interface MakeCallParams {
  toNumber: string;
  leadId?: string;
  propertyId?: string;
  message?: string;
}

export interface VoiceProvider {
  makeCall(params: MakeCallParams): Promise<{ callId: string; status: string }>;
  getInboundConfig?(): Promise<unknown>;
}

export function getVoiceProvider(): VoiceProvider {
  const provider = process.env.VOICE_PROVIDER || "vapi";

  switch (provider) {
    case "bland":
      return blandProvider;
    case "vapi":
    default:
      return vapiProvider;
  }
}
