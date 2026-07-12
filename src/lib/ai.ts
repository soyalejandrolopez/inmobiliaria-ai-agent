interface AIAnalysisResult {
  summary: string;
  aiScore: number;
  intent: "buy" | "rent" | "sell" | "info";
  wantsVisit: boolean;
  suggestedDate?: string;
  notes: string;
}

export async function analyzeConversation(transcript: string): Promise<AIAnalysisResult> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return fallbackAnalysis(transcript);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Analiza la siguiente conversación de un agente inmobiliario virtual con un cliente. Devuelve SIEMPRE un JSON con: summary (resumen), aiScore (0-100), intent (buy/rent/sell/info), wantsVisit (boolean), suggestedDate (ISO string opcional), notes (string).",
          },
          { role: "user", content: transcript },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return fallbackAnalysis(transcript);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || "",
      aiScore: Math.min(100, Math.max(0, Number(parsed.aiScore) || 50)),
      intent: parsed.intent || "info",
      wantsVisit: Boolean(parsed.wantsVisit),
      suggestedDate: parsed.suggestedDate,
      notes: parsed.notes || "",
    };
  } catch (error) {
    console.error(error);
    return fallbackAnalysis(transcript);
  }
}

function fallbackAnalysis(transcript: string): AIAnalysisResult {
  const lower = transcript.toLowerCase();
  let score = 50;

  if (lower.includes("visita") || lower.includes("ver la propiedad")) score += 25;
  if (lower.includes("precio") || lower.includes("presupuesto")) score += 10;
  if (lower.includes("comprar") || lower.includes("compra")) score += 15;
  if (lower.includes("rentar") || lower.includes("alquilar")) score += 10;
  if (lower.includes("no estoy seguro") || lower.includes("solo información")) score -= 20;

  score = Math.min(100, Math.max(0, score));

  return {
    summary: transcript.slice(0, 200) + (transcript.length > 200 ? "..." : ""),
    aiScore: score,
    intent: lower.includes("comprar") ? "buy" : lower.includes("rentar") ? "rent" : lower.includes("vender") ? "sell" : "info",
    wantsVisit: lower.includes("visita"),
    notes: "Análisis local sin OpenAI. Configura OPENAI_API_KEY para mejor precisión.",
  };
}
