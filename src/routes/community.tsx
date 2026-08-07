import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { POSTS, LISTINGS, LESSONS } from "@/lib/krishi/extra";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Farmer Community, Marketplace & Learning Hub" },
      { name: "description", content: "Ask questions, buy and sell produce, rent machinery and learn modern farming in short lessons." },
      { property: "og:title", content: "Community, Marketplace & Learning" },
      { property: "og:description", content: "A social and trading space for Indian farmers." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const { L } = useLang();
  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Community", "समुदाय")}</h1>
        <Tabs defaultValue="feed" className="mt-5">
          <TabsList className="rounded-full">
            <TabsTrigger value="feed" className="rounded-full">{L("Feed", "फ़ीड")}</TabsTrigger>
            <TabsTrigger value="market" className="rounded-full">{L("Marketplace", "बाज़ार")}</TabsTrigger>
            <TabsTrigger value="learn" className="rounded-full">{L("Learn", "सीखें")}</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4 space-y-3">
            {POSTS.map((p) => (
              <Card key={p.id} className="ks-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg">{p.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{p.author}</p>
                      <p className="text-xs text-muted-foreground">{p.role} · {p.ago}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{L(p.en, p.hi)}</p>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {p.comments}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="market" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LISTINGS.map((m) => (
              <Card key={m.id} className="ks-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{m.emoji}</span>
                    <Badge variant="secondary">{m.kind}</Badge>
                  </div>
                  <p className="mt-2 font-semibold">{L(m.en, m.hi)}</p>
                  <p className="text-sm text-primary">{m.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.seller} · {m.place}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="learn" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LESSONS.map((l) => (
              <Card key={l.id} className="ks-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{l.emoji}</span>
                    <Badge variant="secondary">{l.mins} min</Badge>
                  </div>
                  <p className="mt-2 font-semibold">{L(l.en, l.hi)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{l.body}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}