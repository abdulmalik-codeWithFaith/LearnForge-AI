# LearnForge AI

**Learn it by watching it get built.**

LearnForge AI is an AI-powered personalized learning platform that transforms any learning request into a step-by-step instructional video. Instead of handing learners a finished answer or a wall of code, it plans a real project, breaks it into a teaching-paced sequence, and narrates it — the way a mentor would sit down and build something with you, line by line.

Founded by **Abdulrosheed Abdulmalik** ([@codewithfaith001](https://github.com/abdulmalik-codewithfaith001))

---

## What it does

1. A learner describes what they want to learn and picks an experience level (Beginner / Intermediate / Advanced).
2. An AI plans a small, real, working project that teaches the concept, and breaks it into 4–7 ordered teaching steps.
3. Each step gets real, correct, runnable code and a clear, level-appropriate explanation.
4. The lesson is narrated with AI-generated voice audio and composited into a video — code appears per step, synced to narration, with on-screen captions.
5. The finished lesson streams from the platform's public library, where it can be liked, bookmarked, commented on, and remixed into a personalized version by anyone else.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js (App Router, TypeScript, fullstack — route handlers as the API layer) |
| Styling | Tailwind CSS |
| Database | PostgreSQL ([Neon](https://neon.tech)), via Prisma ORM |
| Auth | Auth.js (NextAuth) — Google OAuth + email/password |
| Async jobs | BullMQ, backed by Redis ([Upstash](https://upstash.com)) |
| Worker | Standalone Node.js process consuming the job queue |
| AI planning & code generation | Gemini (`gemini-2.5-flash`), structured JSON output |
| Text-to-speech | Gemini TTS (`gemini-2.5-flash-preview-tts`) |
| Video rendering | [Remotion](https://remotion.dev) (React-based compositing → MP4) |
| Object storage | Backblaze B2 (S3-compatible API), private bucket + signed URLs |

## Architecture

The core insight of the build is that **lesson generation is too slow and heavy for a normal request/response cycle**, so it's designed as an async pipeline from the ground up:

```
User submits topic + level
        │
        ▼
 POST /api/generate ──► creates GenerationJob row (Postgres)
        │                creates BullMQ job (Redis)
        ▼
  /jobs/[jobId] ──► polls GET /api/jobs/[jobId] every 1.5s
        │
        ▼
   Worker process (separate from the web server)
        │
        ├─ 1. Plan lesson + generate project code (Gemini, structured JSON)
        ├─ 2. Create Category / Lesson / LessonStep rows (Prisma)
        ├─ 3. Generate narration audio for the full lesson (Gemini TTS, one call)
        ├─ 4. Upload narration audio (Backblaze B2)
        ├─ 5. Render video: code reveal + captions synced to narration (Remotion)
        ├─ 6. Upload rendered video (Backblaze B2)
        └─ 7. Mark job COMPLETE, link the finished Lesson
        │
        ▼
  Lesson page renders real steps + streams video via a signed URL
```

Two processes run side by side in development:

```bash
npm run dev     # Next.js app — pages, API routes
npm run worker  # background worker — consumes the generation queue
```

## Data model (high level)

- **User** — Auth.js-backed, supports Google OAuth and email/password (bcrypt-hashed)
- **Lesson** — public or private, belongs to a Category and an author, optionally forked from another Lesson (remix lineage)
- **LessonStep** — ordered code + explanation blocks belonging to a Lesson
- **Video** — one per Lesson, stores the object storage key (not a public URL — the bucket is private, so a fresh signed URL is generated per view)
- **GenerationJob** — tracks the async pipeline's status and progress for a single generation request
- **Like / Bookmark / Comment** — standard community interactions, all scoped to a real logged-in user

## Getting started

```bash
npm install

# Environment variables needed in .env — see below
npx prisma generate
npx prisma migrate dev

npm run dev      # terminal 1
npm run worker   # terminal 2
```

### Required environment variables

```
DATABASE_URL=            # Postgres connection string (Neon)
REDIS_URL=                # Redis connection string (Upstash, rediss:// for TLS)

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

GEMINI_API_KEY=

B2_ENDPOINT=
B2_ACCESS_KEY_ID=
B2_SECRET_ACCESS_KEY=
B2_BUCKET_NAME=
```

## Known constraints

- **Gemini TTS free tier** is limited to 10 requests/day per project — the pipeline is designed to use a single combined narration call per lesson (not per step) to conserve quota, but a real-user-facing deployment will need a paid tier.
- Video rendering is CPU-bound and sequential per lesson (narration → render → upload), so generation time scales with step count — typically 1–3 minutes per lesson on the current pipeline.
- The public storage bucket is private by design; all playback URLs are short-lived signed URLs generated on each page load, not permanent public links.

## Roadmap

- [x] Core generation pipeline (plan → code → narration → video)
- [x] Public library with likes, bookmarks, comments
- [x] Google + email/password auth
- [ ] Remix lineage (generate a personalized version of an existing lesson)
- [ ] Category browsing, trending/featured lessons
- [ ] Production deployment (Vercel + always-on worker host)

---

*Built by Abdulrosheed Abdulmalik — [@codewithfaith001](https://github.com/abfulmalik-codewithfaith001)*