export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type MockLesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: ExperienceLevel;
  author: string;
  durationMin: number;
  likes: number;
  remixes: number;
};

export const mockLessons: MockLesson[] = [
  {
    id: "rate-limiter-node",
    title: "Build a token-bucket rate limiter",
    description:
      "From empty file to a working Express middleware, explained line by line.",
    category: "Backend",
    level: "Intermediate",
    author: "priya.codes",
    durationMin: 18,
    likes: 342,
    remixes: 41,
  },
  {
    id: "react-usestate-basics",
    title: "useState, actually explained",
    description:
      "Why state updates batch, why closures go stale, and how to stop guessing.",
    category: "Frontend",
    level: "Beginner",
    author: "davidbuilds",
    durationMin: 11,
    likes: 891,
    remixes: 120,
  },
  {
    id: "postgres-query-planner",
    title: "Reading a Postgres query plan",
    description:
      "Build a slow query on purpose, then fix it while watching EXPLAIN change.",
    category: "Databases",
    level: "Advanced",
    author: "hana.sql",
    durationMin: 24,
    likes: 205,
    remixes: 19,
  },
  {
    id: "python-decorators",
    title: "Python decorators from first principles",
    description:
      "Wrap a function by hand before you ever type an @ symbol.",
    category: "Python",
    level: "Intermediate",
    author: "marcus.py",
    durationMin: 15,
    likes: 476,
    remixes: 63,
  },
  {
    id: "css-grid-layout",
    title: "A real layout with CSS Grid",
    description:
      "Build a dashboard grid and watch every track and gap get named.",
    category: "Frontend",
    level: "Beginner",
    author: "ines.designs",
    durationMin: 13,
    likes: 610,
    remixes: 88,
  },
  {
    id: "bullmq-worker",
    title: "Background jobs with BullMQ",
    description:
      "A queue, a worker, and a progress bar that isn't lying to you.",
    category: "Backend",
    level: "Intermediate",
    author: "tobias.dev",
    durationMin: 20,
    likes: 158,
    remixes: 27,
  },
];

export type MockStep = {
  id: string;
  order: number;
  timestamp: string;
  title: string;
  code: string;
  explanation: string;
};

export type MockComment = {
  id: string;
  author: string;
  body: string;
  createdAgo: string;
};

const RATE_LIMITER_STEPS: MockStep[] = [
  {
    id: "s1",
    order: 1,
    timestamp: "0:00",
    title: "Set up the bucket's state",
    code: "class TokenBucket {\n  constructor(capacity, refillPerSec) {\n    this.capacity = capacity;\n    this.tokens = capacity;\n    this.refillPerSec = refillPerSec;\n  }\n}",
    explanation:
      "Every rate limiter needs somewhere to track how much allowance is left. We start full, so nobody is throttled before they've made a single request.",
  },
  {
    id: "s2",
    order: 2,
    timestamp: "3:20",
    title: "Refill tokens based on elapsed time",
    code: "refill() {\n  const now = Date.now();\n  const elapsed = (now - this.lastRefill) / 1000;\n  const refreshed = elapsed * this.refillPerSec;\n  this.tokens = Math.min(this.capacity, this.tokens + refreshed);\n  this.lastRefill = now;\n}",
    explanation:
      "Instead of a timer running in the background, we calculate how many tokens should have regenerated since we last checked — cheaper, and correct even if the process was idle.",
  },
  {
    id: "s3",
    order: 3,
    timestamp: "7:45",
    title: "Spend tokens on each request",
    code: "take(n = 1) {\n  this.refill();\n  if (this.tokens < n) return false;\n  this.tokens -= n;\n  return true;\n}",
    explanation:
      "This is the actual gate. Refill first, then check if there's enough left. If not, the caller gets a clean false instead of a thrown error.",
  },
  {
    id: "s4",
    order: 4,
    timestamp: "12:10",
    title: "Wrap it as Express middleware",
    code: "function rateLimit(bucket) {\n  return (req, res, next) => {\n    if (!bucket.take()) {\n      return res.status(429).json({ error: 'Too many requests' });\n    }\n    next();\n  };\n}",
    explanation:
      "The bucket doesn't know anything about HTTP. The middleware is a thin adapter that turns a false from take() into a proper 429 response.",
  },
];

const GENERIC_STEP_TEMPLATE: Array<Pick<MockStep, "title" | "timestamp">> = [
  { title: "Set up the project", timestamp: "0:00" },
  { title: "Write the core logic", timestamp: "4:30" },
  { title: "Handle the edge cases", timestamp: "9:15" },
  { title: "Wire it up end to end", timestamp: "14:00" },
];

function genericStepsFor(lesson: MockLesson): MockStep[] {
  return GENERIC_STEP_TEMPLATE.map((t, i) => ({
    id: `${lesson.id}-s${i + 1}`,
    order: i + 1,
    timestamp: t.timestamp,
    title: t.title,
    code: `// ${lesson.title}\n// step ${i + 1} of ${GENERIC_STEP_TEMPLATE.length}`,
    explanation: `Placeholder walkthrough text for "${t.title.toLowerCase()}" — real narration and code land once generation is wired up.`,
  }));
}

const LESSON_STEPS: Record<string, MockStep[]> = {
  "rate-limiter-node": RATE_LIMITER_STEPS,
};

export function getLessonSteps(lesson: MockLesson): MockStep[] {
  return LESSON_STEPS[lesson.id] ?? genericStepsFor(lesson);
}

const COMMENT_POOL: Array<Pick<MockComment, "author" | "body">> = [
  {
    author: "keiko.codes",
    body: "The refill-on-read trick instead of a background timer finally clicked for me here.",
  },
  {
    author: "sam_r",
    body: "Remixed this into a Redis-backed version for a multi-instance API, worked first try.",
  },
  {
    author: "juanc",
    body: "Would love a follow-up on sliding window vs token bucket trade-offs.",
  },
];

export function getLessonComments(lesson: MockLesson): MockComment[] {
  const count = 1 + (lesson.id.length % COMMENT_POOL.length);
  return COMMENT_POOL.slice(0, count).map((c, i) => ({
    id: `${lesson.id}-c${i + 1}`,
    author: c.author,
    body: c.body,
    createdAgo: `${(i + 1) * 2}d ago`,
  }));
}

export function getLessonById(id: string): MockLesson | undefined {
  return mockLessons.find((l) => l.id === id);
}