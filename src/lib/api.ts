import { supabase } from "@/integrations/supabase/client";
import { BADGES, DEMO, QUESTION_BANK, buildRoadmap, scoreAnswers, type Answer } from "./career-data";

export async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export async function fetchAll() {
  const id = await uid();
  const [p, r, a, rm, b, ap, n] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("resumes").select("*").order("created_at", { ascending: false }).limit(1),
    supabase.from("assessments").select("*").eq("status", "completed").order("completed_at", { ascending: true }),
    supabase.from("roadmap_items").select("*").order("priority"),
    supabase.from("badges").select("*").order("awarded_at"),
    supabase.from("applications").select("*").order("created_at"),
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20),
  ]);
  return {
    userId: id,
    profile: p.data,
    resume: r.data?.[0] ?? null,
    assessments: a.data ?? [],
    roadmap: rm.data ?? [],
    badges: b.data ?? [],
    applications: ap.data ?? [],
    notifications: n.data ?? [],
  };
}
export type AppData = Awaited<ReturnType<typeof fetchAll>>;

export async function notify(user_id: string, message: string) {
  await supabase.from("notifications").insert({ user_id, message });
}

export async function award(user_id: string, code: keyof typeof BADGES) {
  const b = BADGES[code];
  const { error } = await supabase.from("badges").insert({ user_id, code, title: b.title, description: b.description });
  if (!error) await notify(user_id, `Badge unlocked: ${b.title} 🏅`);
}

export async function checkRoadmapBadges(user_id: string) {
  const { data } = await supabase.from("roadmap_items").select("completed");
  const done = (data ?? []).filter((x) => x.completed).length;
  if (done >= 3) await award(user_id, "roadmap_3");
  if (data?.length && done === data.length) await award(user_id, "roadmap_all");
}

/** Saves a finished test, adapts roadmap and awards badges. */
export async function completeAssessment(id: string, user_id: string, role: string, answers: Answer[], previousScore: number | null) {
  const { score, topic } = scoreAnswers(answers);
  await supabase.from("assessments").update({ answers: answers as never, score, topic_scores: topic as never, status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
  // Adapt roadmap: keep completed items, replace pending with fresh gaps
  const { data: existing } = await supabase.from("roadmap_items").select("topic, completed");
  const doneTopics = new Set((existing ?? []).filter((x) => x.completed).map((x) => x.topic));
  await supabase.from("roadmap_items").delete().eq("completed", false).eq("user_id", user_id);
  const items = buildRoadmap(role, topic).filter((i) => !doneTopics.has(i.topic) || (topic[i.topic]?.pct ?? 0) < 40);
  if (items.length) await supabase.from("roadmap_items").insert(items.map((i) => ({ ...i, user_id })) as never);
  await award(user_id, "first_test");
  if (score >= 70) await award(user_id, "score_70");
  if (previousScore != null && score - previousScore >= 10) await award(user_id, "improver");
  await notify(user_id, `Assessment completed — you scored ${score}%. Your roadmap has been updated.`);
  return score;
}

export async function loadDemo() {
  const user_id = await uid();
  await Promise.all(["resumes", "assessments", "roadmap_items", "badges", "applications", "notifications"].map((t) => supabase.from(t as "resumes").delete().eq("user_id", user_id)));
  await supabase.from("profiles").update(DEMO.profile).eq("id", user_id);
  await supabase.from("resumes").insert({ user_id, file_name: "Logashree_Resume.pdf", parsed: DEMO.resume as never });
  const answers: Answer[] = DEMO.answers.map(([qid, correct]) => {
    const q = QUESTION_BANK.find((x) => x.id === qid)!;
    return { qid, topic: q.topic, difficulty: q.difficulty, correct, selected: correct ? q.answer : (q.answer + 1) % 4, ms: 20000 + Math.round(Math.random() * 30000) };
  });
  const { data } = await supabase.from("assessments").insert({ user_id, target_role: "Software Developer", questions: QUESTION_BANK.filter((q) => DEMO.answers.some(([id]) => id === q.id)) as never }).select().single();
  if (data) await completeAssessment(data.id, user_id, "Software Developer", answers, null);
  await award(user_id, "resume_uploaded");
  await supabase.from("applications").insert([
    { user_id, job_id: "j1", company: "Zoho", title: "Software Developer Intern", status: "applied" },
    { user_id, job_id: "j7", company: "TCS Digital", title: "Graduate Engineer Trainee", status: "assessment" },
    { user_id, job_id: "j5", company: "Postman", title: "Software Engineer I", status: "saved" },
  ]);
  await award(user_id, "first_application");
}
