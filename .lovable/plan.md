# CareerPath — Build Plan

A career-readiness platform for engineering students. Because the scope is large, it ships in phases. Each phase leaves a working app.

## Phase 1 — Foundation and the core loop
- Premium light-theme design (custom fonts, deep teal + warm accent palette, optional dark mode)
- Landing page with the specified hero, CTAs, product preview, 7-step "How it works", and the "Built for students..." section
- Lovable Cloud: email/password + Google sign-in, forgot/reset password, protected app area
- 4-step onboarding wizard -> resume upload
- Resume upload (PDF/DOCX drag and drop, staged "Analyzing..." progress) with AI extraction of education, skills, projects, experience, certifications, links
- Resume analysis page: summary, "Resume Evidence" skill chart, improvement suggestions

## Phase 2 — Assessment and gaps
- AI-generated 15-question MCQ test (Easy/Medium/Hard, topic-tagged, adaptive difficulty, response time tracked)
- Results: overall score, topic breakdown chart, Strong / Needs Improvement / Missing skills, role requirement coverage, "Your next best action"

## Phase 3 — Roadmap, retest, badges
- Personalized roadmap (why it matters, resources, practice tasks, mini projects, time estimates, completion tracking)
- Retest with previous vs new comparison charts; roadmap adapts to results
- Event-driven badges (first test, score jump, roadmap milestones)

## Phase 4 — Dashboard, jobs, tracker
- Career Readiness dashboard with Recharts analytics
- Job matches with requirement coverage and job-specific prep
- Kanban application tracker (Saved, Applied, Assessment, Interview, Offer, Rejected)
- In-app notifications, profile management

## Demo mode
- "Try demo" button loads Logashree (AI & Data Science, 2027, Software Developer) with skills, an initial assessment, gaps, roadmap, and job listings

## Technical details
- TanStack Start routes; protected pages under the managed auth layout
- Cloud tables: profiles, resumes, skills, assessments, questions/answers, roadmap_items, badges, jobs, applications, notifications (RLS per user; jobs public read; demo data seeded in migration)
- Resume parsing and question/roadmap generation via server functions calling the Lovable AI Gateway, with a structured mock parser fallback
- Recharts for charts, shadcn/ui components, Lucide icons
