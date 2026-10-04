import { createServerFn } from "@tanstack/react-start";

export const DEMO_EMAIL = "logashree.demo@careerpath.app";
export const DEMO_PASSWORD = "CareerPath-Demo-2027!";

/** Ensures the shared, confirmed demo student account exists. Only ever touches this one fixed account. */
export const ensureDemoUser = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "Logashree" },
  });
  if (error && !/already|registered|exists/i.test(error.message)) {
    console.error("ensureDemoUser", error);
    return { ok: false };
  }
  return { ok: true };
});
