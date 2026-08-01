import { createServerFn } from "@tanstack/react-start";

type ChatMsg = { role: "user" | "assistant"; content: string };

type ChatInput = { messages: ChatMsg[]; lang: "en" | "hi" };

function validate(data: unknown): ChatInput {
  const d = data as ChatInput;
  if (!d || !Array.isArray(d.messages)) throw new Error("messages required");
  return {
    lang: d.lang === "hi" ? "hi" : "en",
    messages: d.messages
      .filter((m) => m && typeof m.content === "string")
      .slice(-14)
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.slice(0, 4000) })),
  };
}

export const askKrishiAI = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured yet." };

    const system =
      "You are Krishi Sahayk, a friendly AI assistant for small and marginal Indian farmers. " +
      "Give practical, low-cost, field-ready advice on crops, soil, pests, irrigation, weather planning, mandi selling and government schemes. " +
      "Use simple words, short paragraphs and bullet points. Mention approximate quantities per acre and both organic and chemical options where relevant. " +
      "Always add a one-line caution to confirm with the local Krishi Vigyan Kendra for chemical doses. " +
      (data.lang === "hi"
        ? "Reply in simple conversational Hindi (Devanagari script)."
        : "Reply in simple English.");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "google/gemini-3.6-flash",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });

      if (res.status === 429) return { ok: false as const, error: "Too many requests right now. Please try again in a minute." };
      if (res.status === 402) return { ok: false as const, error: "AI credits are exhausted. Please add credits to continue." };
      if (!res.ok) {
        const body = await res.text();
        console.error("AI gateway error", res.status, body);
        return { ok: false as const, error: "The assistant could not answer just now. Please try again." };
      }

      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const reply = json.choices?.[0]?.message?.content?.trim();
      if (!reply) return { ok: false as const, error: "Empty response from the assistant." };
      return { ok: true as const, reply };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Network problem while reaching the assistant." };
    }
  });