import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, ScanSearch, ClipboardCheck, Target, Map, RefreshCw, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPath — Know where you stand. Become job ready." },
      { name: "description", content: "CareerPath tests your real skills, finds your gaps and builds a personalized roadmap for internships and placements." },
      { property: "og:title", content: "CareerPath — Become job ready" },
      { property: "og:description", content: "Skill assessment, gap analysis and personalized roadmaps for engineering students." },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: FileText, t: "Upload Resume" }, { icon: ScanSearch, t: "Analyze Skills" }, { icon: ClipboardCheck, t: "Take Personalized Assessment" },
  { icon: Target, t: "Discover Skill Gaps" }, { icon: Map, t: "Follow Your Roadmap" }, { icon: RefreshCw, t: "Retest & Improve" }, { icon: Briefcase, t: "Get Job Recommendations" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2"><ThemeToggle /><Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button><Button asChild><Link to="/auth">Get started</Link></Button></div>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">For engineering students preparing for placements</p>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">Know Where You Stand. Know What To Learn. <span className="text-primary">Become Job Ready.</span></h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">CareerPath analyzes your resume, tests your actual skills, identifies your gaps, builds a personalized roadmap, and helps you prepare for the jobs you want.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/auth">Start My Career Assessment<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="#how">Explore How It Works</a></Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Logashree · Software Developer</p><p className="font-display text-5xl font-semibold">72%</p><p className="text-sm text-success">+18% since last attempt</p></div><div className="grid h-24 w-24 place-items-center rounded-full border-8 border-primary/80 font-display text-xl font-semibold">81%</div></div>
          <div className="mt-6 space-y-3">{[["Language & OOP", 86], ["Data Structures & Algorithms", 58], ["SQL & Databases", 73]].map(([k, v]) => (
            <div key={k as string}><div className="flex justify-between text-sm"><span>{k}</span><span>{v}%</span></div><div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${v}%` }} /></div></div>
          ))}</div>
          <div className="mt-6 rounded-xl bg-secondary p-4 text-sm"><p className="font-semibold text-secondary-foreground">Your next best action</p><p className="text-muted-foreground">Solve 5 medium dynamic programming problems</p></div>
        </div>
      </section>
      <section id="how" className="border-y bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{STEPS.map((s, i) => (
            <div key={s.t} className="rounded-2xl border bg-background p-5"><div className="flex items-center justify-between"><s.icon className="h-6 w-6 text-primary" /><span className="font-display text-sm text-muted-foreground">0{i + 1}</span></div><p className="mt-4 font-semibold">{s.t}</p></div>
          ))}</div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">Built for students who don't know what to learn next.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{["Engineering students", "Internship seekers", "Placement preparation", "Fresh graduates"].map((x) => (
          <div key={x} className="flex items-center gap-3 rounded-xl border p-4"><CheckCircle2 className="h-5 w-5 text-success" /><span className="font-medium">{x}</span></div>
        ))}</div>
        <Button asChild size="lg" className="mt-10"><Link to="/auth">Start My Career Assessment<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 CareerPath</footer>
    </div>
  );
}
