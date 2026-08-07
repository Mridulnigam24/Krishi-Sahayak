import { createServerFn } from "@tanstack/react-start";
import { agentById } from "./agents";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

export type Attachment = { kind: "image" | "file"; dataUrl: string; name?: string; mime?: string };
type ChatMsg = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };
type ChatInput = { messages: ChatMsg[]; lang: "en" | "hi"; agent?: string; extraSystem?: string };

function clean(data: unknown): ChatInput {
  const d = data as ChatInput;
  if (!d || !Array.isArray(d.messages)) throw new Error("messages required");
  return {
    lang: d.lang === "hi" ? "hi" : "en",
    agent: typeof d.agent === "string" ? d.agent : "general",
    extraSystem: typeof d.extraSystem === "string" ? d.extraSystem.slice(0, 4000) : undefined,
    messages: d.messages
      .filter((m) => m && typeof m.content === "string")
      .slice(-14)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.slice(0, 8000),
        attachments: Array.isArray(m.attachments) ? m.attachments.slice(0, 4) : undefined,
      })),
  };
}

function gatewayError(status: number) {
  if (status === 429) return "Too many requests right now. Please try again in a minute.";
  if (status === 402) return "AI credits are exhausted. Please add credits to continue.";
  return "The assistant could not answer just now. Please try again.";
}

function toParts(m: ChatMsg) {
  if (!m.attachments?.length) return m.content;
  const parts: unknown[] = [{ type: "text", text: m.content || "Analyse this." }];
  for (const a of m.attachments) {
    if (a.kind === "image") parts.push({ type: "image_url", image_url: { url: a.dataUrl } });
    else parts.push({ type: "file", file: { filename: a.name ?? "document.pdf", file_data: a.dataUrl } });
  }
  return parts;
}

async function callChat(key: string, messages: unknown[]) {
  return fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "google/gemini-3.6-flash", messages }),
  });
}

export const askKrishiAI = createServerFn({ method: "POST" })
  .inputValidator(clean)
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured yet." };

    const agent = agentById(data.agent ?? "general");
    const system =
      `${agent.prompt} You are part of Krishi Sahayak, an app for small and marginal Indian farmers. ` +
      "Give practical, low-cost, field-ready advice. Use simple words, short paragraphs and bullet points. " +
      "Mention approximate quantities per acre and both organic and chemical options where relevant. " +
      "Always end with a one-line caution to confirm chemical doses with the local Krishi Vigyan Kendra. " +
      (data.extraSystem ? `Context from the app: ${data.extraSystem} ` : "") +
      (data.lang === "hi"
        ? "Reply in simple conversational Hindi (Devanagari script)."
        : "Reply in simple English.");

    try {
      const res = await callChat(key, [
        { role: "system", content: system },
        ...data.messages.map((m) => ({ role: m.role, content: toParts(m) })),
      ]);
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text());
        return { ok: false as const, error: gatewayError(res.status) };
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

/* ---------- Speech to text ---------- */

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = d as { audio: string; mime?: string };
    if (!v?.audio) throw new Error("audio required");
    return { audio: v.audio, mime: v.mime ?? "audio/webm" };
  })
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured yet." };
    try {
      const b64 = data.audio.includes(",") ? data.audio.split(",")[1]! : data.audio;
      const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append("file", new Blob([bin], { type: data.mime }), "speech.webm");
      form.append("model", "openai/gpt-4o-mini-transcribe");
      const res = await fetch(`${GATEWAY}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}` },
        body: form,
      });
      if (!res.ok) {
        console.error("STT error", res.status, await res.text());
        return { ok: false as const, error: gatewayError(res.status) };
      }
      const json = (await res.json()) as { text?: string };
      return { ok: true as const, text: (json.text ?? "").trim() };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Could not understand the recording." };
    }
  });

/* ---------- Text to speech ---------- */

export const speakText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = d as { text: string };
    if (!v?.text) throw new Error("text required");
    return { text: v.text.slice(0, 2500) };
  })
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured yet." };
    try {
      const res = await fetch(`${GATEWAY}/audio/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini-tts",
          input: data.text,
          voice: "alloy",
          response_format: "mp3",
          instructions: "Speak clearly and warmly, like a helpful village agriculture officer.",
        }),
      });
      if (!res.ok) {
        console.error("TTS error", res.status, await res.text());
        return { ok: false as const, error: gatewayError(res.status) };
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      let s = "";
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return { ok: true as const, audio: `data:audio/mpeg;base64,${btoa(s)}` };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Could not generate the voice reply." };
    }
  });

/* ---------- Structured image analysis ---------- */

export type ImageReport = {
  name: string;
  confidence: number;
  category: string;
  crop: string;
  symptoms: string[];
  reason: string;
  organic: string[];
  chemical: string[];
  prevention: string[];
  products: string[];
  severity: string;
};

export const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = d as { image: string; lang?: string; subject?: string };
    if (!v?.image) throw new Error("image required");
    return {
      image: v.image,
      lang: v.lang === "hi" ? "hi" : "en",
      subject: v.subject === "livestock" ? "livestock" : v.subject === "soil" ? "soil" : "crop",
    };
  })
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured yet." };

    const target =
      data.subject === "livestock"
        ? "an animal (cattle, buffalo, goat or poultry) — identify the likely disease"
        : data.subject === "soil"
          ? "a soil sample or soil report — identify soil type, health and deficiencies"
          : "a crop photo — identify disease, pest, weed or nutrient deficiency";

    const system =
      `You analyse ${target}. Reply with ONLY a JSON object, no markdown fence, using keys: ` +
      `name, confidence (number 0-100), category, crop, severity, symptoms (array of short strings), reason (string), ` +
      `organic (array), chemical (array with dose per acre), prevention (array), products (array of common Indian product names). ` +
      (data.lang === "hi" ? "All text values must be in simple Hindi (Devanagari)." : "All text values in simple English.");

    try {
      const res = await callChat(key, [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyse this image and return the JSON object." },
            { type: "image_url", image_url: { url: data.image } },
          ],
        },
      ]);
      if (!res.ok) {
        console.error("Vision error", res.status, await res.text());
        return { ok: false as const, error: gatewayError(res.status) };
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const raw = json.choices?.[0]?.message?.content ?? "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return { ok: false as const, error: "Could not read the analysis. Please try another photo." };
      const parsed = JSON.parse(match[0]) as ImageReport;
      return { ok: true as const, report: parsed };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Image analysis failed. Please try again." };
    }
  });