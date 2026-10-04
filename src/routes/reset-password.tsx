import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set a new password — CareerPath" }, { name: "description", content: "Choose a new password for your CareerPath account." }, { property: "og:title", content: "Set a new password — CareerPath" }, { property: "og:description", content: "Choose a new CareerPath password." }] }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm"><CardContent className="space-y-5 p-8">
        <Logo />
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="pw">New password</Label><Input id="pw" type="password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <Button className="w-full" type="submit">Update password</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
