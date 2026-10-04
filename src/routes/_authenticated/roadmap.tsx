import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, ExternalLink } from "lucide-react";
import { getOverview, toggleTask } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/roadmap")({ component: Roadmap });

function Roadmap() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["overview"], queryFn: getOverview });
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const groups = Object.entries(data.tasks.reduce<Record<string, typeof data.tasks>>((m, t) => ((m[t.topic] ??= []).push(t), m), {}));
  const done = data.tasks.filter((t) => t.completed).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold">Your roadmap</h1><p className="text-muted-foreground">Built from your latest assessment gaps. It updates every time you retest.</p></div>
        <Button asChild><Link to="/assessment">Retest my skills</Link></Button>
      </div>
      <Card><CardContent className="p-5"><div className="flex justify-between text-sm"><span>{done} of {data.tasks.length} tasks complete</span><span>{data.tasks.filter((t) => !t.completed).reduce((s, t) => s + t.est_hours, 0)}h remaining</span></div><Progress value={data.tasks.length ? (done / data.tasks.length) * 100 : 0} className="mt-2" /></CardContent></Card>
      {!groups.length && <p className="text-muted-foreground">No tasks yet — take an assessment to generate your roadmap.</p>}
      <ol className="relative space-y-6 border-l-2 border-border pl-6">
        {groups.map(([topic, tasks]) => (
          <li key={topic}>
            <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary" />
            <h2 className="text-xl font-semibold">{topic}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{tasks[0]?.why}</p>
            <Card><CardContent className="divide-y p-0">
              {tasks.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-start gap-3 p-4">
                  <Checkbox checked={t.completed} onCheckedChange={async (v) => { await toggleTask(t.id, !!v); qc.invalidateQueries({ queryKey: ["overview"] }); }} className="mt-0.5" />
                  <div className="flex-1">
                    <p className={t.completed ? "text-muted-foreground line-through" : "font-medium"}>{t.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="capitalize">{t.kind}</Badge>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.est_hours}h</span>
                      {t.resource_url && <a href={t.resource_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-primary hover:underline">{t.resource_label}<ExternalLink className="h-3 w-3" /></a>}
                    </div>
                  </div>
                </label>
              ))}
            </CardContent></Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
