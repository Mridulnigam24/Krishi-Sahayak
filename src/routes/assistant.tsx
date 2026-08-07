import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Mic, Send, Square, ImagePlus, Camera, FileText, Volume2, Loader2, X, Paperclip } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { AGENTS } from "@/lib/krishi/agents";
import { askKrishiAI, transcribeAudio, speakText, type Attachment } from "@/lib/krishi/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Krishi Sahayak" },
      { name: "description", content: "Ask farming questions by text, voice, photo or PDF and get expert answers in Hindi or English." },
      { property: "og:title", content: "Krishi Sahayak AI Assistant" },
      { property: "og:description", content: "Multimodal AI farming assistant: text, voice, camera and documents." },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

function AssistantPage() {
  const { lang, L } = useLang();
  const [agent, setAgent] = useState("general");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState<Attachment[]>([]);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    taRef.current?.focus();
  }, [busy]);

  const readFile = (f: File, kind: "image" | "file") =>
    new Promise<Attachment>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve({ kind, dataUrl: String(r.result), name: f.name, mime: f.type });
      r.onerror = reject;
      r.readAsDataURL(f);
    });

  const pick = async (list: FileList | null, kind: "image" | "file") => {
    if (!list?.length) return;
    const files = Array.from(list).slice(0, 3);
    const atts = await Promise.all(files.map((f) => readFile(f, kind)));
    setPending((p) => [...p, ...atts].slice(0, 4));
  };

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if ((!text && !pending.length) || busy) return;
    const userMsg: Msg = { role: "user", content: text || L("Analyse this.", "इसे जांचिए।"), attachments: pending };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setPending([]);
    setBusy(true);
    const res = await askKrishiAI({ data: { messages: next, lang, agent } });
    setBusy(false);
    if (res.ok) setMsgs((m) => [...m, { role: "assistant", content: res.reply }]);
    else toast.error(res.error);
  }

  async function toggleRecord() {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        const b64 = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.readAsDataURL(blob);
        });
        setBusy(true);
        const out = await transcribeAudio({ data: { audio: b64, mime: blob.type } });
        setBusy(false);
        if (out.ok && out.text) void send(out.text);
        else toast.error(out.ok ? L("Nothing was heard.", "कुछ सुनाई नहीं दिया।") : out.error);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error(L("Microphone permission is needed.", "माइक की अनुमति चाहिए।"));
    }
  }

  async function speak(i: number, text: string) {
    setSpeaking(i);
    const res = await speakText({ data: { text } });
    setSpeaking(null);
    if (!res.ok) return toast.error(res.error);
    audioRef.current?.pause();
    const a = new Audio(res.audio);
    audioRef.current = a;
    void a.play();
  }

  const current = AGENTS.find((a) => a.id === agent) ?? AGENTS[0]!;
  const suggestions = [
    L("My wheat leaves are turning yellow", "मेरे गेहूं के पत्ते पीले हो रहे हैं"),
    L("Should I sell onion now or wait?", "प्याज अभी बेचूं या रुकूं?"),
    L("Best fertiliser dose for 2 acre paddy", "2 एकड़ धान के लिए खाद की मात्रा"),
    L("Which schemes can I apply for?", "मैं कौन सी योजनाएं ले सकता हूं?"),
  ];

  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">
          <span className="ks-grad-text">{L("AI Assistant", "AI सहायक")}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {L("Type, speak, or show a photo — get answers in your language.", "लिखें, बोलें या फोटो दिखाएं — अपनी भाषा में जवाब पाएं।")}
        </p>

        <div className="ks-noscroll mt-4 flex gap-2 overflow-x-auto pb-1">
          {AGENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAgent(a.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                agent === a.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{a.emoji}</span>
              <span className="font-medium">{L(a.en, a.hi)}</span>
            </button>
          ))}
        </div>

        <div className="ks-card mt-4 flex min-h-[52vh] flex-col p-4">
          <div className="flex-1 space-y-4">
            {msgs.length === 0 && (
              <div className="py-8 text-center">
                <div className="ks-grad-primary mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-3xl">{current.emoji}</div>
                <p className="mt-3 font-semibold">{L(current.en, current.hi)}</p>
                <p className="text-sm text-muted-foreground">{L(current.descEn, current.descHi)}</p>
                <div className="mx-auto mt-5 grid max-w-xl gap-2 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => void send(s)} className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-left text-sm transition hover:border-primary/50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div className={m.role === "user" ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground" : "max-w-[95%]"}>
                  {!!m.attachments?.length && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {m.attachments.map((a, j) =>
                        a.kind === "image" ? (
                          <img key={j} src={a.dataUrl} alt="attachment" className="h-20 w-20 rounded-xl object-cover" />
                        ) : (
                          <span key={j} className="flex items-center gap-1 rounded-lg bg-background/20 px-2 py-1 text-xs">
                            <FileText className="h-3 w-3" /> {a.name}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                  {m.role === "assistant" ? (
                    <>
                      <div className="ks-md text-sm leading-relaxed">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      <button onClick={() => void speak(i, m.content)} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        {speaking === i ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                        {L("Listen", "सुनें")}
                      </button>
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> {L("Thinking…", "सोच रहा हूं…")}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {!!pending.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {pending.map((a, i) => (
                <span key={i} className="relative">
                  {a.kind === "image" ? (
                    <img src={a.dataUrl} alt="pending" className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <span className="flex h-16 w-28 items-center justify-center gap-1 rounded-xl bg-secondary px-2 text-[11px]">
                      <FileText className="h-3 w-3" /> {a.name?.slice(0, 14)}
                    </span>
                  )}
                  <button
                    onClick={() => setPending((p) => p.filter((_, j) => j !== i))}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 rounded-2xl border border-border bg-background p-2">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder={L("Ask anything about your farm…", "अपने खेत के बारे में कुछ भी पूछें…")}
              className="resize-none border-0 bg-transparent focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => fileRef.current?.click()} aria-label="Upload image">
                  <ImagePlus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => camRef.current?.click()} aria-label="Camera">
                  <Camera className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => docRef.current?.click()} aria-label="Upload document">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={recording ? "destructive" : "secondary"}
                  size="icon"
                  className={`rounded-full ${recording ? "ks-listening" : ""}`}
                  onClick={() => void toggleRecord()}
                  aria-label="Record voice"
                >
                  {recording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button size="icon" className="rounded-full" onClick={() => void send()} disabled={busy} aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => void pick(e.target.files, "image")} />
          <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => void pick(e.target.files, "image")} />
          <input ref={docRef} type="file" accept="application/pdf" hidden onChange={(e) => void pick(e.target.files, "file")} />
        </div>
      </div>
    </Layout>
  );
}