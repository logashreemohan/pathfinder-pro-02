import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ensureDemoUser, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo.functions";
import { seedDemoIfEmpty } from "@/lib/api";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CareerPath" },
      { name: "description", content: "Sign in or create your CareerPath account to start your career assessment." },
      { property: "og:title", content: "Sign in — CareerPath" },
      { property: "og:description", content: "Sign in or create your CareerPath account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function afterSignIn() {
    const { data } = await supabase.auth.getUser();
    const { data: p } = await supabase.from("profiles").select("onboarded").eq("id", data.user!.id).maybeSingle();
    navigate({ to: p?.onboarded ? "/dashboard" : "/onboarding" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy("form");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/onboarding", data: { full_name: name } } });
        if (error) throw error;
        if (!data.session) { toast.success("Check your email to confirm your account."); return; }
        await afterSignIn();
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await afterSignIn();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(null); }
  }

  async function google() {
    setBusy("google");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) { toast.error("Google sign-in failed"); setBusy(null); return; }
    if (r.redirected) return;
    await afterSignIn();
  }

  async function demo() {
    setBusy("demo");
    try {
      const r = await ensureDemoUser();
      if (!r.ok) throw new Error("Demo is unavailable right now");
      const { error } = await supabase.auth.signInWithPassword({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
      if (error) throw error;
      await seedDemoIfEmpty();
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
      setBusy(null);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link to="/" className="[&_span.grid]:bg-primary-foreground [&_span.grid]:text-primary"><Logo /></Link>
        <div>
          <p className="font-display text-4xl font-semibold leading-tight">"I finally knew exactly what to study before placements."</p>
          <p className="mt-4 text-primary-foreground/70">Know where you stand, what to learn, and how close you are to job ready.</p>
        </div>
        <p className="text-sm text-primary-foreground/60">For 2nd, 3rd and 4th-year engineering students</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="lg:hidden"><Logo /></div>
            <div>
              <h1 className="text-2xl font-semibold">{mode === "forgot" ? "Reset your password" : mode === "signup" ? "Create your account" : "Welcome back"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{mode === "forgot" ? "We'll email you a reset link." : "Start your career assessment in minutes."}</p>
            </div>

            <Button onClick={demo} disabled={!!busy} className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {busy === "demo" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Try as Demo Student (Logashree)
            </Button>

            {mode !== "forgot" && (
              <Tabs value={mode} onValueChange={(v) => setMode(v as "signin")}>
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
              </Tabs>
            )}

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (<div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>)}
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex justify-between"><Label htmlFor="pw">Password</Label>{mode === "signin" && <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">Forgot password?</button>}</div>
                  <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={!!busy}>
                {busy === "form" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "signup" ? "Create account" : mode === "signin" ? "Sign in" : "Send reset link"}
              </Button>
            </form>
            {mode === "forgot" ? (
              <button onClick={() => setMode("signin")} className="w-full text-center text-sm text-primary hover:underline">Back to sign in</button>
            ) : (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
                <Button variant="outline" className="w-full" onClick={google} disabled={!!busy}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-7.9z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
                  Continue with Google
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
