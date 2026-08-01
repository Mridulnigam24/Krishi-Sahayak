import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { askKrishiAI } from "@/lib/krishi/ai.functions";
import { ks } from "@/lib/krishi/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Farming Assistant — Krishi Sahayk" },
      { name: "description", content: "Ask the Krishi Sahayk AI assistant anything about crops, pests, irrigation, fertiliser, mandi selling and schemes in Hindi or English." },
      { property: "og:title", content: "AI Farming Assistant — Krishi Sahayk" },
      { property: "og:description", content: "Chat with an AI assistant built for Indian farmers." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGEST = {
  en: ["How do I control stem borer in paddy?", "Best fertiliser schedule for wheat", "When should I sell my onion crop?", "How to apply for PM-KISAN?"],
  hi: ["धान में तना छेदक कैसे रोकें?", "गेहूं के लिए खाद का सही समय", "प्याज कब बेचना बेहतर रहेगा?", "पीएम-किसान के लिए आवेदन कैसे करें?"],
};

function ChatPage() {
  const { t, lang } = useLang();
  const ask = useServerFn(askKrishiAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMessages(ks.getChat<Msg>()), []);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, busy]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({ data: { messages: next, lang } });
      if (!res.ok) {
        toast.error(res.error);
        setMessages(next);
      } else {
        const done: Msg[] = [...next, { role: "assistant", content: res.reply }];
        setMessages(done);
        ks.setChat(done.slice(-40));
      }
    } catch {
      toast.error(lang === "hi" ? "जवाब नहीं मिल सका।" : "Could not reach the assistant.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <MessageCircle className="h-7 w-7 text-primary" /> {t("chatbot")}
        </h1>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { setMessages([]); ks.setChat([]); }}>
            <Trash2 className="mr-1 h-4 w-4" /> {lang === "hi" ? "साफ करें" : "Clear"}
          </Button>
        )}
      </div>

      <Card className="mt-4 border-border">
        <CardContent className="flex h-[62vh] flex-col gap-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="m-auto max-w-md text-center">
              <span className="text-4xl">🌾</span>
              <p className="mt-2 font-semibold">{lang === "hi" ? "नमस्ते किसान भाई!" : "Namaste, farmer friend!"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "hi" ? "खेती, कीट, खाद, मौसम या योजनाओं के बारे में कुछ भी पूछें।" : "Ask anything about crops, pests, fertiliser, weather or schemes."}
              </p>
              <div className="mt-4 grid gap-2">
                {SUGGEST[lang].map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl bg-secondary px-3 py-2 text-left text-sm hover:bg-secondary/70">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                }
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy && <p className="animate-pulse text-sm text-muted-foreground">{lang === "hi" ? "सोच रहा हूँ..." : "Thinking..."}</p>}
          <div ref={endRef} />
        </CardContent>
      </Card>

      <div className="mt-3 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={2}
          placeholder={lang === "hi" ? "अपना सवाल लिखें..." : "Type your question..."}
          className="resize-none rounded-2xl"
        />
        <Button size="icon" className="h-11 w-11 rounded-full" disabled={busy || !input.trim()} onClick={() => void send(input)}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Layout>
  );
}