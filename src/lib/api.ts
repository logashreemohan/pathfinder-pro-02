import { supabase } from "@/integrations/supabase/client";
import { COMPETENCY_TASKS, COMPETENCY_WHY, evaluate, pickBalanced, type Difficulty } from "./career-data";

export async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export async function getProfile() {
  const id = await uid();
  const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getOverview() {
  const id = await uid();
  const [p, a, t, b] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("assessments").select("*").order("created_at", { ascending: true }),
    supabase.from("roadmap_tasks").select("*").order("position"),
    supabase.from("badges").select("*").order("awarded_at"),
  ]);
  const all = a.data ?? [];
  return {
    profile: p.data,
    completed: all.filter((x) => x.status === "completed"),
    inProgress: all.find((x) => x.status === "in_progress") ?? null,
    tasks: t.data ?? [],
    badges: b.data ?? [],
  };
}

export async function award(user_id: string, code: string, title: string, description: string) {
  await supabase.from("badges").insert({ user_id, code, title, description });
}

/** Returns the in-progress assessment or creates a new balanced 15-question one. */
export async function startOrResumeAssessment(role: string) {
  const user_id = await uid();
  const { data: open } = await supabase.from("assessments").select("id").eq("status", "in_progress").limit(1);
  if (open?.[0]) return open[0].id;
  const { data: a, error } = await supabase.from("assessments").insert({ user_id, target_role: role }).select("id").single();
  if (error || !a) throw error ?? new Error("Could not start");
  const qs = pickBalanced(role).map((x, i) => ({
    assessment_id: a.id, user_id, position: i, topic: x.competency, difficulty: x.difficulty,
    question: x.question, options: x.options, correct_index: x.answer,
  }));
  const { error: qe } = await supabase.from("assessment_questions").insert(qs);
  if (qe) throw qe;
  return a.id;
}

export async function getAssessment(id: string) {
  const [a, q, ans] = await Promise.all([
    supabase.from("assessments").select("*").eq("id", id).single(),
    supabase.from("assessment_questions").select("*").eq("assessment_id", id).order("position"),
    supabase.from("assessment_answers").select("*").eq("assessment_id", id),
  ]);
  if (a.error) throw a.error;
  return { assessment: a.data, questions: q.data ?? [], answers: ans.data ?? [] };
}

/** Persists one answer immediately (upsert per question) so progress survives reloads. */
export async function saveAnswer(assessment_id: string, question_id: string, selected_index: number, is_correct: boolean, response_ms: number) {
  const user_id = await uid();
  const { error } = await supabase.from("assessment_answers").upsert(
    { assessment_id, question_id, user_id, selected_index, is_correct, response_ms, answered_at: new Date().toISOString() },
    { onConflict: "question_id" },
  );
  if (error) throw error;
}

/** Scores the attempt, rebuilds pending roadmap tasks for gaps, awards badges. */
export async function submitAssessment(id: string) {
  const user_id = await uid();
  const { questions, answers } = await getAssessment(id);
  const rows = questions.map((q) => ({ competency: q.topic, difficulty: q.difficulty as Difficulty, correct: !!answers.find((a) => a.question_id === q.id)?.is_correct }));
  const r = evaluate(rows);
  const { data: prev } = await supabase.from("assessments").select("score").eq("status", "completed").order("completed_at", { ascending: false }).limit(1);
  await supabase.from("assessments").update({ status: "completed", score: r.score, topic_scores: r.by, completed_at: new Date().toISOString() }).eq("id", id);

  await supabase.from("roadmap_tasks").delete().eq("user_id", user_id).eq("completed", false);
  const { data: done } = await supabase.from("roadmap_tasks").select("title");
  const doneTitles = new Set((done ?? []).map((d) => d.title));
  const focus = [...r.gaps, ...r.improve];
  const tasks = focus.flatMap((c, ci) => (COMPETENCY_TASKS[c] ?? []).filter((t) => !doneTitles.has(t.title)).map((t, ti) => ({
    user_id, topic: c, title: t.title, why: COMPETENCY_WHY[c], kind: t.kind, est_hours: t.hours,
    resource_label: t.label || null, resource_url: t.url || null, position: ci * 10 + ti,
  })));
  if (tasks.length) await supabase.from("roadmap_tasks").insert(tasks);

  await award(user_id, "first_test", "First Step", "Completed your first career assessment");
  if (r.score >= 70) await award(user_id, "score_70", "Job Ready Core", "Scored 70% or more on an assessment");
  const prevScore = prev?.[0]?.score;
  if (prevScore != null && r.score - prevScore >= 10) await award(user_id, "improver", "Rising Star", "Improved your score by 10+ points on a retest");
  return r;
}

export async function toggleTask(id: string, completed: boolean) {
  const user_id = await uid();
  await supabase.from("roadmap_tasks").update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq("id", id);
  const { data } = await supabase.from("roadmap_tasks").select("completed");
  const n = (data ?? []).filter((x) => x.completed).length;
  if (n >= 3) await award(user_id, "roadmap_3", "Momentum", "Completed 3 roadmap tasks");
  if (data?.length && n === data.length) await award(user_id, "roadmap_all", "Roadmap Finisher", "Completed every roadmap task");
}

/** Seeds Logashree's history: a completed first attempt + roadmap with some progress. */
export async function seedDemoIfEmpty() {
  const user_id = await uid();
  const { data: existing } = await supabase.from("assessments").select("id").limit(1);
  await supabase.from("profiles").update({
    full_name: "Logashree", college: "Sri Krishna College of Engineering", degree: "B.Tech", branch: "AI & Data Science",
    grad_year: 2027, location: "Coimbatore", target_role: "Software Developer", onboarded: true,
    skills: ["Python", "Java", "C", "SQL", "JavaScript", "Git", "DSA", "OOP"],
  }).eq("id", user_id);
  if (existing?.length) return;
  const id = await startOrResumeAssessment("Software Developer");
  const { questions } = await getAssessment(id);
  // Strong OOP, weak DSA, mid SQL
  const pattern: Record<string, boolean[]> = {
    "Language & OOP": [true, true, true, true, false],
    "Data Structures & Algorithms": [true, false, false, false, false],
    "SQL & Databases": [true, true, false, true, false],
  };
  const counters: Record<string, number> = {};
  for (const q of questions) {
    const i = (counters[q.topic] = (counters[q.topic] ?? -1) + 1);
    const ok = pattern[q.topic]?.[i] ?? false;
    await saveAnswer(id, q.id, ok ? q.correct_index : (q.correct_index + 1) % 4, ok, 15000 + Math.round(Math.random() * 40000));
  }
  await submitAssessment(id);
  const { data: t } = await supabase.from("roadmap_tasks").select("id").order("position").limit(2);
  for (const x of t ?? []) await supabase.from("roadmap_tasks").update({ completed: true, completed_at: new Date().toISOString() }).eq("id", x.id);
}
