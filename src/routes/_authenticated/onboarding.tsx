import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, uid } from "@/lib/api";
import { ROLES, SKILL_GROUPS } from "@/lib/career-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/onboarding")({ component: Onboarding });

export function ProfileForm({ onDone, submitLabel }: { onDone: () => void; submitLabel: string }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ full_name: "", college: "", degree: "B.E.", branch: "", grad_year: 2027, location: "", target_role: "Software Developer", skills: [] as string[], type: "Internship", mode: "Hybrid", locations: "", salary: "" });
  useEffect(() => { getProfile().then((p) => p && setF((o) => ({ ...o, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v != null)), ...(p.preferences as object) }))); }, []);
  const set = (k: string, v: unknown) => setF((o) => ({ ...o, [k]: v }));
  async function save() {
    const id = await uid();
    const { error } = await supabase.from("profiles").update({ full_name: f.full_name, college: f.college, degree: f.degree, branch: f.branch, grad_year: Number(f.grad_year), location: f.location, target_role: f.target_role, skills: f.skills, preferences: { type: f.type, mode: f.mode, locations: f.locations, salary: f.salary }, onboarded: true, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    onDone();
  }
  const field = (k: keyof typeof f, label: string, type = "text") => (
    <div className="space-y-2"><Label htmlFor={k}>{label}</Label><Input id={k} type={type} value={String(f[k])} onChange={(e) => set(k, e.target.value)} /></div>
  );
  const steps = ["Personal info", "Career goal", "Current skills", "Preferences"];
  return (
    <Card><CardContent className="space-y-6 p-6 sm:p-8">
      <div><p className="text-sm text-muted-foreground">Step {step + 1} of 4 · {steps[step]}</p><Progress value={((step + 1) / 4) * 100} className="mt-2" /></div>
      {step === 0 && <div className="grid gap-4 sm:grid-cols-2">{field("full_name", "Full name")}{field("college", "College")}{field("degree", "Degree")}{field("branch", "Branch")}{field("grad_year", "Graduation year", "number")}{field("location", "Location")}</div>}
      {step === 1 && <div className="grid gap-2 sm:grid-cols-3">{ROLES.map((r) => <button key={r} onClick={() => set("target_role", r)} className={`rounded-xl border p-4 text-left text-sm font-medium transition ${f.target_role === r ? "border-primary bg-secondary" : "hover:bg-muted"}`}>{r}</button>)}</div>}
      {step === 2 && <div className="space-y-4">{Object.entries(SKILL_GROUPS).map(([g, list]) => <div key={g}><p className="mb-2 text-sm font-semibold">{g}</p><div className="flex flex-wrap gap-2">{list.map((s) => { const on = f.skills.includes(s); return <button key={s} onClick={() => set("skills", on ? f.skills.filter((x) => x !== s) : [...f.skills, s])} className={`rounded-full border px-3 py-1 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{s}</button>; })}</div></div>)}</div>}
      {step === 3 && <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Looking for</Label><div className="flex gap-2">{["Internship", "Full-time"].map((x) => <Button key={x} type="button" variant={f.type === x ? "default" : "outline"} onClick={() => set("type", x)}>{x}</Button>)}</div></div>
        <div className="space-y-2"><Label>Work mode</Label><div className="flex gap-2">{["Remote", "Hybrid", "On-site"].map((x) => <Button key={x} type="button" variant={f.mode === x ? "default" : "outline"} onClick={() => set("mode", x)}>{x}</Button>)}</div></div>
        {field("locations", "Preferred locations")}{field("salary", "Expected salary / stipend")}
      </div>}
      <div className="flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        {step < 3 ? <Button onClick={() => setStep(step + 1)}>Continue</Button> : <Button onClick={save}>{submitLabel}</Button>}
      </div>
    </CardContent></Card>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="text-3xl font-semibold">Let's set up your profile</h1><p className="text-muted-foreground">This shapes your assessment and roadmap.</p></div>
      <ProfileForm submitLabel="Finish & go to dashboard" onDone={() => navigate({ to: "/dashboard" })} />
    </div>
  );
}
