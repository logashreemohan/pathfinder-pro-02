import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, Target, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getOverview } from "@/lib/api";
import { evaluate } from "@/lib/career-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { data } = useQuery({ queryKey: ["overview"], queryFn: getOverview });
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const last = data.completed[data.completed.length - 1];
  const prev = data.completed[data.completed.length - 2];
  const done = data.tasks.filter((t) => t.completed).length;
  const by = (last?.topic_scores ?? {}) as Record<string, { pct: number }>;
  const coverage = last ? Math.round(Object.values(by).reduce((s, b) => s + Math.min(b.pct, 70) / 70, 0) / (Object.keys(by).length || 1) * 100) : 0;
  const readiness = last ? Math.round(last.score! * 0.6 + (data.tasks.length ? (done / data.tasks.length) * 100 : 0) * 0.4) : 0;
  void evaluate;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">Welcome back</p><h1 className="text-3xl font-semibold">{data.profile?.full_name ?? "Student"}</h1><p className="text-muted-foreground">{[data.profile?.degree, data.profile?.branch, data.profile?.grad_year].filter(Boolean).join(" · ")} · Target: <span className="font-medium text-foreground">{data.profile?.target_role}</span></p></div>
        <Button asChild><Link to="/assessment">{data.inProgress ? "Resume assessment" : last ? "Retake assessment" : "Start assessment"}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={Target} label="Career readiness" value={`${readiness}%`} />
        <Stat icon={TrendingUp} label="Latest score" value={last ? `${last.score}%` : "—"} sub={prev ? `${last.score! - prev.score! >= 0 ? "+" : ""}${last.score! - prev.score!}% vs previous` : undefined} />
        <Stat icon={Target} label="Requirement coverage" value={last ? `${coverage}%` : "—"} />
        <Stat icon={Award} label="Badges" value={String(data.badges.length)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Score progress</CardTitle></CardHeader><CardContent className="h-64">
          {data.completed.length ? <ResponsiveContainer><LineChart data={data.completed.map((a, i) => ({ name: `Attempt ${i + 1}`, score: a.score }))}><XAxis dataKey="name" fontSize={12} /><YAxis domain={[0, 100]} fontSize={12} /><Tooltip /><Line dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ResponsiveContainer> : <p className="text-muted-foreground">Take your first assessment to see progress.</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Your next best action</CardTitle></CardHeader><CardContent className="space-y-3">
          {!last ? <p className="text-sm">Take the 15-question assessment to find your gaps.</p> : (() => { const next = data.tasks.find((t) => !t.completed); return next ? <><p className="text-sm text-muted-foreground">{next.topic}</p><p className="font-medium">{next.title}</p><Button asChild variant="outline" size="sm"><Link to="/roadmap">Open roadmap</Link></Button></> : <><p className="text-sm">Roadmap complete — retest to measure your growth.</p><Button asChild size="sm"><Link to="/assessment">Retest now</Link></Button></>; })()}
          <div className="pt-2"><p className="mb-1 text-xs text-muted-foreground">Roadmap {done}/{data.tasks.length}</p><Progress value={data.tasks.length ? (done / data.tasks.length) * 100 : 0} /></div>
        </CardContent></Card>
      </div>
      {last && <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/results/$id" params={{ id: last.id }}>View latest results</Link></Button></div>}
      <Card><CardHeader><CardTitle>Achievements</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">
        {data.badges.length ? data.badges.map((b) => <Badge key={b.id} variant="secondary" className="px-3 py-1.5"><Award className="mr-1 h-3.5 w-3.5" />{b.title}</Badge>) : <p className="text-sm text-muted-foreground">Complete an assessment to earn your first badge.</p>}
      </CardContent></Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Target; label: string; value: string; sub?: string }) {
  return <Card><CardContent className="p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">{label}</p><p className="font-display text-3xl font-semibold">{value}</p>{sub && <p className="text-xs text-success">{sub}</p>}</CardContent></Card>;
}
