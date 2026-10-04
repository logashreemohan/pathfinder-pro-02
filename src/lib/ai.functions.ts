import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const QSchema = z.object({
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.number().int().min(0).max(3),
});

/** Generates extra MCQs tailored to role, skills and weak topics via Lovable AI. Returns [] on failure (caller falls back to the bank). */
export const generateQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ role: z.string(), topics: z.array(z.string()).max(12), weak: z.array(z.string()).max(12) }).parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { questions: [] };
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You write accurate placement-interview MCQs for Indian engineering students. Return only JSON." },
            { role: "user", content: `Target role: ${data.role}. Topics: ${data.topics.join(", ")}. Emphasize weak topics: ${data.weak.join(", ") || "none"}. Write 18 MCQs, 6 easy, 6 medium, 6 hard, spread across topics (topic must be exactly one of the listed topics). Respond as {"questions":[{"topic","difficulty","question","options":[4 strings],"answer":index}]}` },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) return { questions: [] };
      const json = await res.json();
      const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
      const qs = z.array(QSchema).safeParse(parsed.questions);
      if (!qs.success) return { questions: [] };
      return { questions: qs.data.filter((q) => data.topics.includes(q.topic)).map((q, i) => ({ ...q, id: `ai${Date.now()}_${i}` })) };
    } catch (e) {
      console.error("generateQuestions failed", e);
      return { questions: [] };
    }
  });
