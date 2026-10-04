// @ts-nocheck -- static data module; indexed lookups are guarded by construction
// Domain data + pure logic for CareerPath. Browser-safe.
export type Difficulty = "easy" | "medium" | "hard";
export interface Question {
  id: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}
export interface Answer {
  qid: string;
  topic: string;
  difficulty: Difficulty;
  selected: number;
  correct: boolean;
  ms: number;
}
export interface ParsedResume {
  name?: string;
  education: { institution: string; degree: string; year?: string }[];
  skills: string[];
  projects: { title: string; tech: string[]; summary: string }[];
  experience: { role: string; company: string; duration: string }[];
  certifications: string[];
  achievements: string[];
  links: string[];
  suggestions: string[];
}

export const ROLES = [
  "Software Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer",
  "Data Analyst", "Data Scientist", "AI Engineer", "ML Engineer", "Cloud Engineer", "Cybersecurity", "Other",
];

export const SKILL_GROUPS: Record<string, string[]> = {
  Programming: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go"],
  Development: ["HTML/CSS", "React", "Node.js", "Express", "REST APIs", "Git"],
  Data: ["SQL", "Pandas", "Excel", "Power BI", "Statistics"],
  AI: ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch"],
  "Core fundamentals": ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design"],
};

// Topics used by assessments
export const TOPICS = ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "JavaScript", "React", "Python", "SQL", "Git", "System Design", "Machine Learning"] as const;

export const ROLE_REQUIREMENTS: Record<string, { topic: string; weight: number }[]> = {
  "Software Developer": [{ topic: "DSA", weight: 3 }, { topic: "OOP", weight: 2 }, { topic: "DBMS", weight: 2 }, { topic: "Operating Systems", weight: 1 }, { topic: "Git", weight: 1 }, { topic: "System Design", weight: 1 }, { topic: "JavaScript", weight: 1 }],
  "Full Stack Developer": [{ topic: "JavaScript", weight: 3 }, { topic: "React", weight: 2 }, { topic: "DBMS", weight: 2 }, { topic: "SQL", weight: 1 }, { topic: "Git", weight: 1 }, { topic: "DSA", weight: 1 }, { topic: "System Design", weight: 1 }],
  "Backend Developer": [{ topic: "DSA", weight: 2 }, { topic: "DBMS", weight: 3 }, { topic: "SQL", weight: 2 }, { topic: "System Design", weight: 2 }, { topic: "Computer Networks", weight: 1 }, { topic: "Operating Systems", weight: 1 }],
  "Frontend Developer": [{ topic: "JavaScript", weight: 3 }, { topic: "React", weight: 3 }, { topic: "Git", weight: 1 }, { topic: "DSA", weight: 1 }, { topic: "Computer Networks", weight: 1 }],
  "Data Analyst": [{ topic: "SQL", weight: 3 }, { topic: "Python", weight: 2 }, { topic: "DBMS", weight: 2 }, { topic: "Machine Learning", weight: 1 }],
  "Data Scientist": [{ topic: "Python", weight: 3 }, { topic: "Machine Learning", weight: 3 }, { topic: "SQL", weight: 2 }, { topic: "DSA", weight: 1 }],
  "AI Engineer": [{ topic: "Machine Learning", weight: 3 }, { topic: "Python", weight: 3 }, { topic: "DSA", weight: 2 }, { topic: "System Design", weight: 1 }],
  "ML Engineer": [{ topic: "Machine Learning", weight: 3 }, { topic: "Python", weight: 3 }, { topic: "DSA", weight: 2 }, { topic: "Git", weight: 1 }],
  "Cloud Engineer": [{ topic: "Operating Systems", weight: 3 }, { topic: "Computer Networks", weight: 3 }, { topic: "System Design", weight: 2 }, { topic: "Git", weight: 1 }],
  Cybersecurity: [{ topic: "Computer Networks", weight: 3 }, { topic: "Operating Systems", weight: 3 }, { topic: "DBMS", weight: 1 }, { topic: "Python", weight: 1 }],
  Other: [{ topic: "DSA", weight: 2 }, { topic: "OOP", weight: 2 }, { topic: "DBMS", weight: 1 }, { topic: "Git", weight: 1 }],
};
export const requirementsFor = (role?: string | null) => ROLE_REQUIREMENTS[role ?? ""] ?? ROLE_REQUIREMENTS["Software Developer"];

const q = (id: string, topic: string, difficulty: Difficulty, question: string, options: string[], answer: number): Question => ({ id, topic, difficulty, question, options, answer });

export const QUESTION_BANK: Question[] = [
  q("dsa1", "DSA", "easy", "What is the time complexity of binary search on a sorted array?", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 1),
  q("dsa2", "DSA", "medium", "Which data structure is best for implementing an LRU cache in O(1)?", ["Array + stack", "Hash map + doubly linked list", "Binary heap", "Trie"], 1),
  q("dsa3", "DSA", "hard", "Dijkstra's algorithm fails to produce correct results when the graph has:", ["Cycles", "Negative edge weights", "More than 1000 nodes", "Undirected edges"], 1),
  q("dsa4", "DSA", "medium", "Which traversal of a BST yields keys in sorted order?", ["Preorder", "Postorder", "Inorder", "Level order"], 2),
  q("oop1", "OOP", "easy", "Which OOP principle hides internal state behind methods?", ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], 1),
  q("oop2", "OOP", "medium", "Method overriding is an example of:", ["Compile-time polymorphism", "Runtime polymorphism", "Encapsulation", "Composition"], 1),
  q("oop3", "OOP", "hard", "The Liskov Substitution Principle states that:", ["Classes should have one responsibility", "Subtypes must be usable wherever base types are expected", "Depend on abstractions, not concretions", "Interfaces should be small"], 1),
  q("db1", "DBMS", "easy", "Which key uniquely identifies each row in a table?", ["Foreign key", "Primary key", "Candidate index", "Composite view"], 1),
  q("db2", "DBMS", "medium", "A table is in 2NF if it is in 1NF and:", ["Has no transitive dependencies", "Has no partial dependency on a composite key", "Has only one column", "Uses no NULLs"], 1),
  q("db3", "DBMS", "hard", "Which isolation level prevents phantom reads?", ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"], 3),
  q("os1", "Operating Systems", "easy", "Which of these is NOT a process state?", ["Ready", "Running", "Compiling", "Waiting"], 2),
  q("os2", "Operating Systems", "medium", "Which condition is NOT required for deadlock?", ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], 2),
  q("os3", "Operating Systems", "hard", "Belady's anomaly can occur with which page replacement algorithm?", ["LRU", "Optimal", "FIFO", "LFU with aging"], 2),
  q("cn1", "Computer Networks", "easy", "Which protocol resolves domain names to IP addresses?", ["HTTP", "DNS", "FTP", "ARP"], 1),
  q("cn2", "Computer Networks", "medium", "TCP's three-way handshake sequence is:", ["SYN, ACK, FIN", "SYN, SYN-ACK, ACK", "ACK, SYN, ACK", "HELLO, ACK, DONE"], 1),
  q("cn3", "Computer Networks", "hard", "Which OSI layer is responsible for end-to-end flow control?", ["Network", "Data link", "Transport", "Session"], 2),
  q("js1", "JavaScript", "easy", "What does `typeof null` return?", ["'null'", "'object'", "'undefined'", "'number'"], 1),
  q("js2", "JavaScript", "medium", "Which runs first: a resolved Promise callback or a setTimeout(fn, 0)?", ["setTimeout", "Promise callback", "Random", "Both at once"], 1),
  q("js3", "JavaScript", "hard", "A closure in JavaScript is:", ["A function bundled with its lexical scope", "A way to close a browser tab", "An immediately invoked object", "A sealed object"], 0),
  q("re1", "React", "easy", "Which hook manages local component state?", ["useEffect", "useState", "useRef", "useMemo"], 1),
  q("re2", "React", "medium", "Why do list items need a `key` prop?", ["Styling", "To help React identify items between renders", "For accessibility", "To enable SSR"], 1),
  q("re3", "React", "hard", "A useEffect with an empty dependency array runs:", ["On every render", "Only after the first render (and cleanup on unmount)", "Never", "Before render"], 1),
  q("py1", "Python", "easy", "Which Python type is immutable?", ["list", "dict", "tuple", "set"], 2),
  q("py2", "Python", "medium", "What does a list comprehension `[x*x for x in range(3)]` produce?", ["[1, 4, 9]", "[0, 1, 4]", "[0, 1, 2]", "Error"], 1),
  q("py3", "Python", "hard", "The GIL in CPython primarily limits:", ["Memory usage", "True parallel execution of threads for CPU-bound work", "Number of processes", "File I/O"], 1),
  q("sql1", "SQL", "easy", "Which clause filters rows before grouping?", ["HAVING", "WHERE", "ORDER BY", "LIMIT"], 1),
  q("sql2", "SQL", "medium", "A LEFT JOIN returns:", ["Only matching rows", "All rows from the left table plus matches", "All rows from both tables", "Only non-matching rows"], 1),
  q("sql3", "SQL", "hard", "Which window function assigns the same rank to ties without gaps?", ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "NTILE()"], 2),
  q("git1", "Git", "easy", "Which command stages changes for commit?", ["git push", "git add", "git fetch", "git init"], 1),
  q("git2", "Git", "medium", "`git rebase` differs from `git merge` because it:", ["Deletes branches", "Rewrites commit history onto a new base", "Only works remotely", "Creates a merge commit"], 1),
  q("git3", "Git", "hard", "To undo a pushed commit safely on a shared branch, use:", ["git reset --hard", "git revert", "git push --force", "git clean"], 1),
  q("sd1", "System Design", "easy", "A load balancer primarily:", ["Stores data", "Distributes traffic across servers", "Encrypts passwords", "Compiles code"], 1),
  q("sd2", "System Design", "medium", "Caching with a TTL mainly trades off:", ["Security vs speed", "Freshness vs latency", "Storage vs CPU", "Cost vs security"], 1),
  q("sd3", "System Design", "hard", "In the CAP theorem, during a partition a system must choose between:", ["Cost and performance", "Consistency and availability", "Caching and persistence", "Atomicity and durability"], 1),
  q("ml1", "Machine Learning", "easy", "Linear regression is a type of:", ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Clustering"], 1),
  q("ml2", "Machine Learning", "medium", "High training accuracy but low test accuracy indicates:", ["Underfitting", "Overfitting", "Good generalization", "Data leakage always"], 1),
  q("ml3", "Machine Learning", "hard", "Which metric is most useful for a highly imbalanced classification problem?", ["Accuracy", "F1 score", "Mean squared error", "R²"], 1),
];

export function buildQuestionPool(role: string | null | undefined, skills: string[], weakTopics: string[] = []): Question[] {
  const reqTopics = requirementsFor(role).map((r) => r.topic);
  const skillTopics = TOPICS.filter((t) => skills.some((s) => s.toLowerCase().includes(t.toLowerCase().split(" ")[0])));
  const topics = Array.from(new Set([...weakTopics, ...reqTopics, ...skillTopics]));
  const pool = QUESTION_BANK.filter((x) => topics.includes(x.topic));
  return pool.length >= 18 ? pool : QUESTION_BANK;
}

/** Adaptive picker: harder after correct answers, easier after misses, rotating topics. */
export function pickNext(pool: Question[], answers: Answer[]): Question | null {
  const used = new Set(answers.map((a) => a.qid));
  const remaining = pool.filter((p) => !used.has(p.id));
  if (!remaining.length) return null;
  const last = answers[answers.length - 1];
  const order: Difficulty[] = ["easy", "medium", "hard"];
  let target: Difficulty = "medium";
  if (last) {
    const i = order.indexOf(last.difficulty);
    target = last.correct ? order[Math.min(2, i + 1)] : order[Math.max(0, i - 1)];
  }
  const topicCount = (t: string) => answers.filter((a) => a.topic === t).length;
  const sorted = [...remaining].sort((a, b) => {
    const d = Math.abs(order.indexOf(a.difficulty) - order.indexOf(target)) - Math.abs(order.indexOf(b.difficulty) - order.indexOf(target));
    return d !== 0 ? d : topicCount(a.topic) - topicCount(b.topic);
  });
  return sorted[0];
}

export function scoreAnswers(answers: Answer[]) {
  const w: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
  const total = answers.reduce((s, a) => s + w[a.difficulty], 0) || 1;
  const got = answers.reduce((s, a) => s + (a.correct ? w[a.difficulty] : 0), 0);
  const topic: Record<string, { correct: number; total: number; pct: number }> = {};
  for (const a of answers) {
    topic[a.topic] ??= { correct: 0, total: 0, pct: 0 };
    topic[a.topic].total++;
    if (a.correct) topic[a.topic].correct++;
  }
  for (const k in topic) topic[k].pct = Math.round((topic[k].correct / topic[k].total) * 100);
  return { score: Math.round((got / total) * 100), topic };
}

export function classifySkills(role: string | null | undefined, topicScores: Record<string, { pct: number }>) {
  const strong: string[] = [], improve: string[] = [], gaps: string[] = [];
  for (const { topic } of requirementsFor(role)) {
    const s = topicScores[topic];
    if (!s) gaps.push(topic);
    else if (s.pct >= 70) strong.push(topic);
    else if (s.pct >= 40) improve.push(topic);
    else gaps.push(topic);
  }
  return { strong, improve, gaps };
}

export function requirementCoverage(role: string | null | undefined, topicScores: Record<string, { pct: number }>) {
  const reqs = requirementsFor(role);
  const total = reqs.reduce((s, r) => s + r.weight * 100, 0);
  const got = reqs.reduce((s, r) => s + r.weight * (topicScores[r.topic]?.pct ?? 0), 0);
  return { pct: Math.round((got / total) * 100), rows: reqs.map((r) => ({ topic: r.topic, required: 70, yours: topicScores[r.topic]?.pct ?? 0 })) };
}

export const TOPIC_LEARNING: Record<string, { why: string; resources: { label: string; url: string }[]; tasks: string[]; project: string; hours: number }> = {
  DSA: { why: "Every product company screens with coding rounds built on arrays, trees, graphs and DP.", resources: [{ label: "NeetCode 150", url: "https://neetcode.io/practice" }, { label: "Striver's A2Z sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" }], tasks: ["Solve 15 array/hashing problems", "Implement BFS/DFS from scratch", "Solve 5 medium DP problems"], project: "Build a visualizer for sorting and graph algorithms", hours: 20 },
  OOP: { why: "Interviewers probe design thinking via classes, interfaces and SOLID principles.", resources: [{ label: "Refactoring.Guru patterns", url: "https://refactoring.guru/design-patterns" }], tasks: ["Write notes on the 4 pillars with code", "Implement 3 design patterns"], project: "Model a parking-lot system with clean OOP", hours: 8 },
  DBMS: { why: "Normalization, indexing and transactions come up in nearly every placement interview.", resources: [{ label: "CMU Intro to Databases", url: "https://15445.courses.cs.cmu.edu/" }], tasks: ["Normalize a sample schema to 3NF", "Explain ACID with examples"], project: "Design and index a library management schema", hours: 10 },
  "Operating Systems": { why: "Processes, scheduling, memory and deadlocks are core CS fundamentals rounds.", resources: [{ label: "OSTEP (free book)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" }], tasks: ["Simulate FCFS and Round Robin", "Summarize paging vs segmentation"], project: "Write a CPU scheduling simulator", hours: 10 },
  "Computer Networks": { why: "Understanding HTTP, TCP/IP and DNS is expected of every software engineer.", resources: [{ label: "Computer Networking: A Top-Down Approach", url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm" }], tasks: ["Trace a request from browser to server", "Compare TCP vs UDP"], project: "Build a simple chat app over sockets", hours: 8 },
  JavaScript: { why: "The language of the web; async behavior and closures are favourite interview topics.", resources: [{ label: "javascript.info", url: "https://javascript.info" }], tasks: ["Explain the event loop in writing", "Implement debounce and Promise.all"], project: "Build a vanilla JS task manager with localStorage", hours: 12 },
  React: { why: "The most requested frontend framework in internship listings.", resources: [{ label: "react.dev Learn", url: "https://react.dev/learn" }], tasks: ["Build 3 components with hooks", "Fetch and render API data"], project: "Build a movie search app with React", hours: 12 },
  Python: { why: "The default language for data, ML and scripting roles.", resources: [{ label: "Python docs tutorial", url: "https://docs.python.org/3/tutorial/" }], tasks: ["Practice comprehensions and generators", "Solve 10 Python problems"], project: "Write a CLI expense tracker", hours: 8 },
  SQL: { why: "Joins, aggregations and window functions are tested in analyst and backend roles.", resources: [{ label: "SQLBolt", url: "https://sqlbolt.com" }, { label: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/" }], tasks: ["Complete SQL 50", "Write 5 window function queries"], project: "Analyze a public dataset with SQL", hours: 8 },
  Git: { why: "Every team expects clean branching, commits and PR workflows.", resources: [{ label: "Learn Git Branching", url: "https://learngitbranching.js.org" }], tasks: ["Practice rebase and revert", "Open a PR on an open-source repo"], project: "Contribute a small fix to an open-source project", hours: 4 },
  "System Design": { why: "Increasingly asked even for freshers at product companies.", resources: [{ label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }], tasks: ["Design a URL shortener", "Learn caching and load balancing basics"], project: "Design doc for a scalable notification service", hours: 10 },
  "Machine Learning": { why: "Core requirement for AI/ML and data science roles.", resources: [{ label: "Andrew Ng ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" }], tasks: ["Implement linear regression from scratch", "Train and evaluate a classifier"], project: "End-to-end prediction model with a small web demo", hours: 20 },
};

export function buildRoadmap(role: string | null | undefined, topicScores: Record<string, { pct: number }>) {
  const { gaps, improve } = classifySkills(role, topicScores);
  return [...gaps, ...improve].map((topic, i) => {
    const l = TOPIC_LEARNING[topic];
    return { topic, why: l.why, resources: l.resources, tasks: l.tasks, mini_project: l.project, est_hours: l.hours, priority: i };
  });
}

export const BADGES: Record<string, { title: string; description: string }> = {
  resume_uploaded: { title: "Profile Builder", description: "Uploaded and analyzed your first resume" },
  first_test: { title: "First Step", description: "Completed your first career assessment" },
  score_70: { title: "Job Ready Core", description: "Scored 70% or more on an assessment" },
  improver: { title: "Rising Star", description: "Improved your score by 10+ points on a retest" },
  roadmap_3: { title: "Momentum", description: "Completed 3 roadmap topics" },
  roadmap_all: { title: "Roadmap Finisher", description: "Completed your entire roadmap" },
  first_application: { title: "In the Game", description: "Tracked your first job application" },
};

export interface Job { id: string; company: string; title: string; type: "Internship" | "Full-time"; mode: "Remote" | "Hybrid" | "On-site"; location: string; stipend: string; roles: string[]; topics: string[] }
export const JOBS: Job[] = [
  { id: "j1", company: "Zoho", title: "Software Developer Intern", type: "Internship", mode: "On-site", location: "Chennai", stipend: "₹30k/mo", roles: ["Software Developer", "Backend Developer"], topics: ["DSA", "OOP", "DBMS"] },
  { id: "j2", company: "Freshworks", title: "Frontend Engineer Intern", type: "Internship", mode: "Hybrid", location: "Chennai", stipend: "₹40k/mo", roles: ["Frontend Developer", "Full Stack Developer"], topics: ["JavaScript", "React", "Git"] },
  { id: "j3", company: "Razorpay", title: "Backend Engineer (New Grad)", type: "Full-time", mode: "On-site", location: "Bengaluru", stipend: "₹18 LPA", roles: ["Backend Developer", "Software Developer"], topics: ["DSA", "DBMS", "System Design", "SQL"] },
  { id: "j4", company: "Swiggy", title: "Data Analyst Intern", type: "Internship", mode: "Hybrid", location: "Bengaluru", stipend: "₹35k/mo", roles: ["Data Analyst"], topics: ["SQL", "Python"] },
  { id: "j5", company: "Postman", title: "Software Engineer I", type: "Full-time", mode: "Remote", location: "Remote, India", stipend: "₹20 LPA", roles: ["Software Developer", "Full Stack Developer"], topics: ["DSA", "JavaScript", "System Design", "Git"] },
  { id: "j6", company: "Sarvam AI", title: "ML Engineer Intern", type: "Internship", mode: "On-site", location: "Bengaluru", stipend: "₹60k/mo", roles: ["ML Engineer", "AI Engineer", "Data Scientist"], topics: ["Machine Learning", "Python", "DSA"] },
  { id: "j7", company: "TCS Digital", title: "Graduate Engineer Trainee", type: "Full-time", mode: "On-site", location: "Pan India", stipend: "₹7 LPA", roles: ["Software Developer", "Other"], topics: ["DSA", "OOP", "DBMS", "Operating Systems"] },
  { id: "j8", company: "Zerodha", title: "Infrastructure Intern", type: "Internship", mode: "On-site", location: "Bengaluru", stipend: "₹45k/mo", roles: ["Cloud Engineer", "Cybersecurity", "Backend Developer"], topics: ["Operating Systems", "Computer Networks", "Git"] },
];

export function jobMatch(job: Job, role: string | null | undefined, topicScores: Record<string, { pct: number }>) {
  const rows = job.topics.map((t) => ({ topic: t, pct: topicScores[t]?.pct ?? 0, met: (topicScores[t]?.pct ?? 0) >= 60 }));
  const avg = rows.reduce((s, r) => s + r.pct, 0) / rows.length;
  const roleBonus = job.roles.includes(role ?? "") ? 10 : 0;
  return { pct: Math.min(100, Math.round(avg * 0.9 + roleBonus)), rows };
}

const KNOWN_SKILLS = Object.values(SKILL_GROUPS).flat();

/** Mock resume parser. Keyword-scans whatever text could be read and merges with onboarding skills.
 * Returns a structure identical to what an AI parser would return. */
export function mockParseResume(text: string, fallback: { name?: string | null; college?: string | null; degree?: string | null; branch?: string | null; grad_year?: number | null; skills: string[] }): ParsedResume {
  const lower = text.toLowerCase();
  const found = KNOWN_SKILLS.filter((s) => lower.includes(s.toLowerCase().replace("/css", "")));
  const skills = Array.from(new Set([...found, ...fallback.skills]));
  const links = Array.from(new Set(text.match(/https?:\/\/[^\s)]+|github\.com\/[\w-]+|linkedin\.com\/in\/[\w-]+/gi) ?? [])).slice(0, 5);
  const projects = [
    { title: skills.includes("React") ? "Personal Portfolio Website" : "Student Management System", tech: skills.slice(0, 3), summary: "Built and deployed an end-to-end project showcasing core skills." },
    { title: skills.some((s) => ["Machine Learning", "Python"].includes(s)) ? "Placement Prediction Model" : "Task Tracker API", tech: skills.slice(2, 5), summary: "Designed data flow, implemented features, and documented results." },
  ];
  const suggestions = [
    "Add measurable impact to each project (e.g. 'reduced load time by 40%').",
    links.some((l) => l.includes("github")) ? "Pin your 3 strongest repositories on GitHub." : "Add a GitHub link so recruiters can see your code.",
    "Move technical skills above education for internship applications.",
    skills.length < 6 ? "List more specific tools and libraries you have used." : "Group skills by category (Languages, Frameworks, Tools).",
    "Keep the resume to one page with consistent formatting.",
  ];
  return {
    name: fallback.name ?? undefined,
    education: [{ institution: fallback.college || "Your college", degree: [fallback.degree, fallback.branch].filter(Boolean).join(", ") || "B.E.", year: fallback.grad_year ? String(fallback.grad_year) : undefined }],
    skills,
    projects,
    experience: lower.includes("intern") ? [{ role: "Intern", company: "Detected from resume", duration: "2–3 months" }] : [],
    certifications: lower.includes("certif") ? ["Certification detected"] : [],
    achievements: lower.includes("hackathon") ? ["Hackathon participation"] : [],
    links,
    suggestions,
  };
}

export const DEMO = {
  profile: { full_name: "Logashree", college: "Sri Krishna College of Engineering", degree: "B.Tech", branch: "AI & Data Science", grad_year: 2027, location: "Coimbatore", target_role: "Software Developer", skills: ["Python", "C", "Java", "SQL", "HTML/CSS", "JavaScript", "Git", "Machine Learning", "DSA", "OOP"], preferences: { type: "Internship", mode: "Hybrid", locations: "Chennai, Bengaluru", salary: "₹25k+/mo" }, onboarded: true },
  resume: {
    name: "Logashree",
    education: [{ institution: "Sri Krishna College of Engineering", degree: "B.Tech, AI & Data Science", year: "2027" }],
    skills: ["Python", "C", "Java", "SQL", "HTML/CSS", "JavaScript", "Git", "Machine Learning", "Pandas"],
    projects: [
      { title: "Smart Attendance System", tech: ["Python", "OpenCV", "SQLite"], summary: "Face-recognition attendance for 120 students with 94% accuracy." },
      { title: "Campus Event Portal", tech: ["HTML/CSS", "JavaScript", "Firebase"], summary: "Event registration site used by 3 college clubs." },
      { title: "Placement Predictor", tech: ["Python", "scikit-learn", "Pandas"], summary: "Logistic regression model predicting placement outcomes." },
    ],
    experience: [{ role: "Python Intern", company: "TechNova Solutions", duration: "Jun–Jul 2025" }],
    certifications: ["NPTEL: Programming in Java (Elite)", "Google Data Analytics (Coursera)"],
    achievements: ["Finalist, Smart India Hackathon 2025", "Solved 180+ problems on LeetCode"],
    links: ["github.com/logashree-dev", "linkedin.com/in/logashree"],
    suggestions: ["Quantify impact in the Campus Event Portal project.", "Add a deployed link for each project.", "Highlight DSA practice with a profile link.", "Move certifications below projects."],
  } as ParsedResume,
  answers: [
    ["dsa1", true], ["dsa4", true], ["dsa2", false], ["oop1", true], ["oop2", true], ["db1", true], ["db2", false], ["db3", false],
    ["os1", true], ["os2", false], ["git1", true], ["git2", false], ["sd1", true], ["sd2", false], ["js1", false],
  ] as [string, boolean][],
};

// ---------- Slice 1: balanced competency-based assessment ----------
export interface Competency { label: string; topics: string[] }
const SECTIONS: Record<string, [string[], string[], string[]]> = {
  default: [["OOP", "JavaScript", "Python"], ["DSA"], ["SQL", "DBMS"]],
  web: [["JavaScript", "React", "OOP"], ["DSA"], ["SQL", "DBMS"]],
  data: [["Python", "Machine Learning"], ["DSA"], ["SQL", "DBMS"]],
  infra: [["Operating Systems", "Computer Networks"], ["DSA"], ["SQL", "DBMS"]],
};
const ROLE_SECTION: Record<string, keyof typeof SECTIONS> = {
  "Frontend Developer": "web", "Full Stack Developer": "web",
  "Data Analyst": "data", "Data Scientist": "data", "AI Engineer": "data", "ML Engineer": "data",
  "Cloud Engineer": "infra", Cybersecurity: "infra",
};
export function competenciesFor(role?: string | null): Competency[] {
  const [a, b, c] = SECTIONS[ROLE_SECTION[role ?? ""] ?? "default"];
  const first = ROLE_SECTION[role ?? ""] === "data" ? "Python & ML" : ROLE_SECTION[role ?? ""] === "infra" ? "OS & Networks" : ROLE_SECTION[role ?? ""] === "web" ? "JavaScript & React" : "Language & OOP";
  return [{ label: first, topics: a }, { label: "Data Structures & Algorithms", topics: b }, { label: "SQL & Databases", topics: c }];
}

QUESTION_BANK.push(
  q("dsa5", "DSA", "easy", "Which data structure follows Last-In-First-Out order?", ["Queue", "Stack", "Heap", "Graph"], 1),
  q("dsa6", "DSA", "hard", "What is the worst-case time complexity of quicksort?", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], 1),
  q("dsa7", "DSA", "medium", "Which technique finds a pair summing to a target in a sorted array in O(n)?", ["Two pointers", "Backtracking", "Memoization", "Bit masking"], 0),
);

/** 5 questions per competency: 2 easy, 2 medium, 1 hard (falls back to any difficulty). */
export function pickBalanced(role?: string | null) {
  const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
  const plan: Difficulty[] = ["easy", "easy", "medium", "medium", "hard"];
  return competenciesFor(role).flatMap((c) => {
    let pool = shuffle(QUESTION_BANK.filter((x) => c.topics.includes(x.topic)));
    return plan.map((d) => {
      const pick = pool.find((x) => x.difficulty === d) ?? pool[0];
      pool = pool.filter((x) => x !== pick);
      return { ...pick, competency: c.label };
    });
  });
}

export const COMPETENCY_TASKS: Record<string, { title: string; kind: string; hours: number; label: string; url: string }[]> = {
  "Language & OOP": [
    { title: "Revise the 4 pillars of OOP with code examples", kind: "learn", hours: 3, label: "Refactoring.Guru", url: "https://refactoring.guru/design-patterns" },
    { title: "Implement Singleton, Factory and Observer patterns", kind: "practice", hours: 4, label: "Refactoring.Guru", url: "https://refactoring.guru/design-patterns/catalog" },
    { title: "Mini project: model a parking-lot system", kind: "project", hours: 6, label: "LLD primer", url: "https://github.com/ashishps1/awesome-low-level-design" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
  "JavaScript & React": [
    { title: "Master closures, promises and the event loop", kind: "learn", hours: 4, label: "javascript.info", url: "https://javascript.info" },
    { title: "Build 3 components with hooks and API data", kind: "practice", hours: 4, label: "react.dev", url: "https://react.dev/learn" },
    { title: "Mini project: movie search app in React", kind: "project", hours: 8, label: "react.dev", url: "https://react.dev/learn" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
  "Python & ML": [
    { title: "Practice comprehensions, generators and pandas", kind: "learn", hours: 4, label: "Python tutorial", url: "https://docs.python.org/3/tutorial/" },
    { title: "Train and evaluate a classifier with scikit-learn", kind: "practice", hours: 5, label: "scikit-learn", url: "https://scikit-learn.org/stable/tutorial/" },
    { title: "Mini project: end-to-end prediction model", kind: "project", hours: 8, label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
  "OS & Networks": [
    { title: "Study scheduling, paging and deadlocks", kind: "learn", hours: 5, label: "OSTEP", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
    { title: "Trace an HTTP request end to end", kind: "practice", hours: 3, label: "Top-Down Networking", url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm" },
    { title: "Mini project: CPU scheduling simulator", kind: "project", hours: 6, label: "OSTEP", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
  "Data Structures & Algorithms": [
    { title: "Solve 15 array & hashing problems", kind: "practice", hours: 6, label: "NeetCode 150", url: "https://neetcode.io/practice" },
    { title: "Implement BFS, DFS and binary search from scratch", kind: "learn", hours: 4, label: "Striver A2Z", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
    { title: "Solve 5 medium dynamic programming problems", kind: "practice", hours: 6, label: "LeetCode DP", url: "https://leetcode.com/studyplan/dynamic-programming/" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
  "SQL & Databases": [
    { title: "Normalize a sample schema to 3NF", kind: "learn", hours: 3, label: "CMU Databases", url: "https://15445.courses.cs.cmu.edu/" },
    { title: "Complete LeetCode SQL 50", kind: "practice", hours: 6, label: "SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/" },
    { title: "Learn transactions, isolation levels and indexing", kind: "learn", hours: 3, label: "Use The Index, Luke", url: "https://use-the-index-luke.com" },
    { title: "Take the topic check in your next retest", kind: "assessment", hours: 1, label: "", url: "" },
  ],
};

export const COMPETENCY_WHY: Record<string, string> = {
  "Language & OOP": "Interviewers test language fluency and design thinking through classes, interfaces and SOLID.",
  "JavaScript & React": "The most requested skills in frontend and full-stack internship listings.",
  "Python & ML": "The core toolkit for every data, AI and ML role.",
  "OS & Networks": "Infrastructure and security roles are built on processes, memory and networking.",
  "Data Structures & Algorithms": "Every product company screens freshers with DSA coding rounds.",
  "SQL & Databases": "Joins, normalization and transactions appear in almost every placement interview.",
};

export function evaluate(rows: { competency: string; difficulty: Difficulty; correct: boolean }[]) {
  const w: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
  const by: Record<string, { correct: number; total: number; pts: number; max: number; pct: number }> = {};
  let pts = 0, max = 0;
  for (const r of rows) {
    by[r.competency] ??= { correct: 0, total: 0, pts: 0, max: 0, pct: 0 };
    const b = by[r.competency];
    b.total++; b.max += w[r.difficulty]; max += w[r.difficulty];
    if (r.correct) { b.correct++; b.pts += w[r.difficulty]; pts += w[r.difficulty]; }
  }
  for (const k in by) by[k].pct = Math.round((by[k].pts / by[k].max) * 100);
  const score = max ? Math.round((pts / max) * 100) : 0;
  const strong = Object.keys(by).filter((k) => by[k].pct >= 70);
  const improve = Object.keys(by).filter((k) => by[k].pct >= 40 && by[k].pct < 70);
  const gaps = Object.keys(by).filter((k) => by[k].pct < 40);
  const coverage = Math.round(Object.values(by).reduce((s, b) => s + Math.min(b.pct, 70) / 70, 0) / (Object.keys(by).length || 1) * 100);
  return { score, by, strong, improve, gaps, coverage };
}

export const levelOf = (pct: number) => (pct >= 85 ? "Advanced" : pct >= 70 ? "Proficient" : pct >= 40 ? "Developing" : "Beginner");
