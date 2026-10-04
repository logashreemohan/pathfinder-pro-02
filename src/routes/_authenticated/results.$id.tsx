import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { getAssessment } from "@/lib/api";
import { COMPETENCY_TASKS, evaluate, levelOf, type Difficulty } from "@/lib/career-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/results/$id")({ component: Results });

function Results() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["results", id],
    queryFn: async () => {
      const d = await getAssessment(id);
      const { data: prev } = await supabase.from("assessments").select("score, topic_scores, completed_at").eq("status", "completed").lt("completed_at", d.assessment.completed_at ?? new Date().toISOString()).order("completed_at", { ascending: false }).limit(1);
      return { ...d, prev: prev?.[0] ?? null };
    },
  });
  if (!data) return <p className="text-muted-foreground">Loading results…</p>;
  const r = evaluate(data.questions.map((q) => ({ competency: q.topic, difficulty: q.difficulty as Difficulty, correct: !!data.answers.find((a) => a.question_id === q.id)?.is_correct })));
  const prevBy = (data.prev?.topic_scores ?? {}) as Record<string, { pct: number }>;
  const delta = data.prev?.score != null ? r.score - data.prev.score : null;
  const chart = Object.entries(r.by).map(([k, v]) => ({ topic: k.replace("Data Structures & Algorithms", "DSA"), yours: v.pct, previous: prevBy[k]?.pct }));
  const avgMs = Math.round(data.answers.reduce((s, a) => s + a.response_ms, 0) / (data.answers.length || 1) / 1000);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 bg-primary text-primary-foreground"><CardContent className="p-6">
          <p className="text-sm opacity-80">Overall score</p>
          <p className="font-display text-6xl font-semibold">{r.score}%</p>
          {delta != null && <p className="mt-1 text-sm font-medium">{delta >= 0 ? "+" : ""}{delta}% vs previous attempt ({data.prev!.score}%)</p>}
          <p className="mt-3 text-sm opacity-80">{data.answers.filter((a) => a.is_correct).length}/15 correct · avg {avgMs}s per question</p>
        </CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Requirement coverage · {data.assessment.target_role}</p><p className="font-display text-4xl font-semibold">{r.coverage}%</p><Progress value={r.coverage} className="mt-3" /><p className="mt-2 text-xs text-muted-foreground">Target: 70% in every core competency</p></CardContent></Card>
        <Card><CardContent className="space-y-2 p-6 text-sm">
          <Row icon={CheckCircle2} cls="text-success" label="Strong skills" items={r.strong} />
          <Row icon={AlertTriangle} cls="text-warning" label="Needs improvement" items={r.improve} />
          <Row icon={XCircle} cls="text-destructive" label="Skill gaps" items={r.gaps} />
        </CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>Topic scorecard</CardTitle></CardHeader><CardContent className="grid gap-6 lg:grid-cols-2">
        <div className="h-64"><ResponsiveContainer><BarChart data={chart}><XAxis dataKey="topic" fontSize={12} /><YAxis domain={[0, 100]} fontSize={12} /><Tooltip /><ReferenceLine y={70} stroke="var(--color-accent)" strokeDasharray="4 4" />{data.prev && <Bar dataKey="previous" fill="var(--color-muted-foreground)" radius={[6, 6, 0, 0]} />}<Bar dataKey="yours" fill="var(--color-primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="space-y-4">{Object.entries(r.by).map(([k, v]) => (
          <div key={k}><div className="flex justify-between text-sm"><span className="font-medium">{k}</span><span>{v.correct}/{v.total} · {v.pct}% · <span className="text-muted-foreground">{levelOf(v.pct)}</span>{prevBy[k] && <span className={v.pct - prevBy[k].pct >= 0 ? " text-success" : " text-destructive"}> ({v.pct - prevBy[k].pct >= 0 ? "+" : ""}{v.pct - prevBy[k].pct})</span>}</span></div><Progress value={v.pct} className="mt-1.5" /></div>
        ))}</div>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Your next steps</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
        {[...r.gaps, ...r.improve].length === 0 ? <p className="text-sm">You're at target level in every competency. Keep practising and start applying!</p> :
          [...r.gaps, ...r.improve].map((c) => { const t = COMPETENCY_TASKS[c]?.[0]; return (
            <div key={c} className="rounded-xl border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r.gaps.includes(c) ? "Skill gap" : "Needs improvement"} · {c}</p>
              <p className="mt-1 font-medium">{t?.title}</p>
              {t?.url && <a href={t.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">{t.label} →</a>}
            </div>); })}
      </CardContent></Card>

      <div className="flex flex-wrap gap-3"><Button asChild><Link to="/roadmap">Open my roadmap<ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button></div>
    </div>
  );
}

function Row({ icon: Icon, cls, label, items }: { icon: typeof CheckCircle2; cls: string; label: string; items: string[] }) {
  return <div className="flex gap-2"><Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cls}`} /><div><p className="font-medium">{label}</p><p className="text-muted-foreground">{items.join(", ") || "None"}</p></div></div>;
}
