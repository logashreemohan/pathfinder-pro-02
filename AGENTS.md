<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
# AGENTS
- Assessment state lives in assessments/assessment_questions/assessment_answers; answers upsert per question so reloads resume. Why: no lost progress.
- Question bank + scoring + roadmap templates are pure functions in src/lib/career-data.ts; DB access in src/lib/api.ts via browser client + RLS. Why: simple, testable.
- Demo login uses a fixed account ensured by a server function with the admin client. Why: one-click demo without email confirmation.
