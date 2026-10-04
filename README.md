# Career Navigator

Build a production-quality, dynamic full-stack web application called "CareerPath".

IMPORTANT:
This is NOT a static landing page or a generic AI chatbot.

The core product is a dynamic career-readiness platform for engineering students, especially 2nd, 3rd and 4th-year students preparing for internships and placements.

CORE PRODUCT LOOP:

Student
→ Sign Up / Login
→ Upload Resume
→ AI Resume Analysis
→ Extract Skills / Projects / Education
→ Generate Personalized Mock Test
→ Student Takes 15-Question MCQ Test
→ Evaluate Score + Topic-Level Performance
→ Identify Strong / Weak / Missing Skills
→ Generate Personalized Learning Roadmap
→ Student Completes Roadmap
→ Retake Assessment
→ Compare Previous vs New Performance
→ Award Achievement / Badge
→ Recommend Matching Jobs
→ Continue Improving Profile

The entire application must be dynamic and data-driven.

==================================================
1. DESIGN DIRECTION
==================================================

Create a premium modern SaaS-style interface.

Visual style:
- Professional
- Clean
- Modern
- Student-focused
- Responsive
- Minimal but visually impressive
- Light theme as default
- Optional dark mode
- Subtle animations
- Excellent spacing
- Rounded cards
- Professional typography
- Accessible contrast

Do NOT make it look like:
- a school website
- a generic job portal
- a generic ChatGPT clone
- an overly colorful children's education app

The UI should feel like a real startup product.

Use:
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Recharts for analytics
- responsive cards
- progress indicators
- badges
- charts
- timelines
- skill graphs where appropriate

==================================================
2. LANDING PAGE
==================================================

Create a strong landing page.

Hero headline:
"Know Where You Stand. Know What To Learn. Become Job Ready."

Subheading:
"CareerPath analyzes your resume, tests your actual skills, identifies your gaps, builds a personalized roadmap, and helps you prepare for the jobs you want."

Primary CTA:
"Start My Career Assessment"

Secondary CTA:
"Explore How It Works"

Show a visual product preview.

How it works:
1. Upload Resume
2. Analyze Skills
3. Take Personalized Assessment
4. Discover Skill Gaps
5. Follow Your Roadmap
6. Retest & Improve
7. Get Job Recommendations

Add a section:
"Built for students who don't know what to learn next."

Mention:
- Engineering students
- Internship seekers
- Placement preparation
- Fresh graduates

==================================================
3. AUTHENTICATION
==================================================

Use Supabase Authentication.

Support:
- Sign up
- Login
- Logout
- Forgot password
- Google authentication if available
- Protected dashboard routes

After signup, send the student through onboarding.

==================================================
4. ONBOARDING
==================================================

Create a dynamic multi-step onboarding wizard.

Step 1: Personal Information (Name, College, Degree, Branch, Graduation year, Location)
Step 2: Career Goal (Software Developer, Full Stack Developer, Backend Developer, Frontend Developer, Data Analyst, Data Scientist, AI Engineer, ML Engineer, Cloud Engineer, Cybersecurity, Other)
Step 3: Current Skills (Programming, Development, Data, AI, Core fundamentals)
Step 4: Career Preferences (Internship / Full-time, Remote / Hybrid / On-site, Locations, Expected salary)

After onboarding, redirect to Resume Upload.

==================================================
5. RESUME UPLOAD
==================================================

Allow PDF and DOCX with drag and drop interface.
Realistic progress experience ("Analyzing your resume...").
Extract Education, Skills, Projects, Experience, Certifications, Achievements, Links, Technologies. Include a mock parsing service with clearly structured data ready for AI integration.

==================================================
6. AI RESUME ANALYSIS
==================================================

Show Profile Summary: skills detected, projects detected, education, experience.
Skill visualization labeled "Resume Evidence" (separated from "Verified Skill Level").
Show resume improvement suggestions.

==================================================
7. DYNAMIC MOCK TEST ENGINE & ADAPTIVE TESTING
==================================================

15 MCQ questions dynamically generated based on resume skills, target role, job market requirements, and previous performance.
Difficulty levels (Easy, Medium, Hard).
Adaptive testing tracking correctness, response time, topic, difficulty.

==================================================
8. TEST RESULT & SKILL GAP ENGINE
==================================================

Overall score, breakdown, topic performance, Strong Skills, Needs Improvement, Skill Gaps, and "Your next best action".
Requirement Coverage comparison for target role.

==================================================
9. PERSONALIZED ROADMAP & RETEST SYSTEM
==================================================

Dynamic roadmap with topics, why it matters, learning resources, practice tasks, mini projects, assessments, estimated time, and completion status.
Roadmap adapts when skills improve or struggle.
Retest system comparing previous vs new score with progress visualization.

==================================================
10. BADGES, DASHBOARD, JOBS & APPLICATION TRACKER
==================================================

- Real event-driven achievement badges
- Full Career Readiness dashboard
- Job matching with requirement coverage breakdown and job-specific prep roadmaps
- Kanban Application Tracker (Saved, Applied, Assessment, Interview, Offer, Rejected)
- Real-time notifications and profile management
- Progress analytics with Recharts

==================================================
11. DEMO MODE
==================================================

Preload a rich demo student profile:
Logashree, AI & Data Science, Grad 2027, Target: Software Developer, with realistic skills, initial assessment results, gaps, roadmap, and demo job listings.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/acae8a67-e001-44ea-82c0-f5891e442899).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
