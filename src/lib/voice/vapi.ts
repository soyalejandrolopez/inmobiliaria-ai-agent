import { VoiceProvider, MakeCallParams } from "./voice-provider";

const VAPI_API_KEY = process.env.VOICE_PROVIDER_API_KEY;
const VAPI_BASE_URL = "https://api.vapi.ai/call";

export const vapiProvider: VoiceProvider = {
  async makeCall({ toNumber, message }: MakeCallParams) {
    if (!VAPI_API_KEY) {
      throw new Error("VAPI API key no configurada");
    }

    const response = await fetch(VAPI_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VAPI_API_KEY}`,
      },
      body: JSON.stringify({
        phoneNumber: toNumber,
        assistant: {
          firstMessage: message || "Hola, soy el asistente inmobiliario de IA. ¿En qué puedo ayudarte hoy?",
          model: {
            provider: "openai",
            model: "gpt-4o",
            systemPrompt: getSystemPrompt(),
          },
          voice: { provider: "11labs", voiceId: "josh" },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`VAPI error: ${error}`);
    }

    const data = await response.json();
    return { callId: data.id, status: data.status };
  },
};

export function getSystemPrompt() {
  return `Eres un asistente inmobiliario virtual llamado Propiedades AI. Tu objetivo es ayudar a clientes a comprar, vender o rentar propiedades. Sigue estas reglas:

1. Saluda de forma profesial y amigable.
2. Pregunta el nombre, email, teléfono, presupuesto, tipo de propiedad buscada y ciudad de interés.
3. Califica el interés: alto (listo para visita), medio (buscando opciones), bajo (solo información).
4. Si el cliente quiere visitar una propiedad, propón horarios y confirma fecha y hora.
5. No inventes datos de propiedades. Si te piden opciones, indica que el agente humano se contactará con detalles.
6. Sé conciso, habla como humano y confirma datos clave repetidamente.
7. Al finalizar, resumen los datos capturados y agradece.`;
}
