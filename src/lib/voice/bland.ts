import { VoiceProvider, MakeCallParams } from "./voice-provider";

const BLAND_API_KEY = process.env.VOICE_PROVIDER_API_KEY;
const BLAND_BASE_URL = "https://api.bland.ai/v1/calls";

export const blandProvider: VoiceProvider = {
  async makeCall({ toNumber, message }: MakeCallParams) {
    if (!BLAND_API_KEY) {
      throw new Error("Bland AI key no configurada");
    }

    const response = await fetch(BLAND_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: BLAND_API_KEY,
      },
      body: JSON.stringify({
        phone_number: toNumber,
        task: message || "Asistente inmobiliario de IA",
        voice: "nat",
        language: "es",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bland error: ${error}`);
    }

    const data = await response.json();
    return { callId: data.call_id, status: data.status };
  },
};
