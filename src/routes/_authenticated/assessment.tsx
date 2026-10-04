import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getAssessment, getProfile, saveAnswer, startOrResumeAssessment, submitAssessment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/assessment")({ component: Assessment });

type Data = Awaited<ReturnType<typeof getAssessment>>;

function Assessment() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [data, setData] = useState<Data | null>(null);
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const started = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      const id = await startOrResumeAssessment(p?.target_role ?? "Software Developer");
      const d = await getAssessment(id);
      setData(d);
      const firstOpen = d.questions.findIndex((q) => !d.answers.some((a) => a.question_id === q.id));
      setI(firstOpen === -1 ? d.questions.length - 1 : firstOpen);
    })().catch((e) => toast.error(e.message));
  }, []);
  useEffect(() => { started.current = Date.now(); }, [i]);

  if (!data) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Preparing your personalized test…</div>;
  const q = data.questions[i];
  const ans = data.answers.find((a) => a.question_id === q.id);
  const answered = data.answers.length;

  async function choose(idx: number) {
    const ms = Date.now() - started.current;
    const correct = idx === q.correct_index;
    setData((d) => d && ({ ...d, answers: [...d.answers.filter((a) => a.question_id !== q.id), { question_id: q.id, selected_index: idx, is_correct: correct, response_ms: ms } as Data["answers"][number]] }));
    try { await saveAnswer(data!.assessment.id, q.id, idx, correct, ms); } catch { toast.error("Couldn't save answer — check your connection"); }
  }
  async function submit() {
    setBusy(true);
    await submitAssessment(data!.assessment.id);
    qc.invalidateQueries();
    navigate({ to: "/results/$id", params: { id: data!.assessment.id } });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Question {i + 1} of {data.questions.length}</span><span className="text-muted-foreground">{answered} answered · saved automatically</span></div>
      <Progress value={(answered / data.questions.length) * 100} />
      <Card><CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex gap-2"><Badge variant="secondary">{q.topic}</Badge><Badge variant="outline" className="capitalize">{q.difficulty}</Badge></div>
        <h2 className="text-xl font-semibold leading-snug">{q.question}</h2>
        <div className="grid gap-3">
          {(q.options as string[]).map((o, idx) => (
            <button key={idx} onClick={() => choose(idx)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${ans?.selected_index === idx ? "border-primary bg-secondary" : "hover:bg-muted"}`}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-semibold">{String.fromCharCode(65 + idx)}</span>{o}
            </button>
          ))}
        </div>
      </CardContent></Card>
      <div className="flex justify-between">
        <Button variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
        {i < data.questions.length - 1 ? <Button disabled={!ans} onClick={() => setI(i + 1)}>Next</Button> : <Button disabled={answered < data.questions.length || busy} onClick={submit}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit test</Button>}
      </div>
      <div className="flex flex-wrap gap-1.5">{data.questions.map((qq, k) => <button key={qq.id} onClick={() => setI(k)} aria-label={`Question ${k + 1}`} className={`h-8 w-8 rounded-md text-xs font-medium ${k === i ? "ring-2 ring-primary" : ""} ${data.answers.some((a) => a.question_id === qq.id) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{k + 1}</button>)}</div>
    </div>
  );
}
