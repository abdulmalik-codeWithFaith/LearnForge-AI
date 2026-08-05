import "dotenv/config";
import { Worker, type Job } from "bullmq";
import { redisConnection } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { generateLesson } from "../lib/gemini";
import { renderLessonVideo } from "../lib/video";
import type { GenerateLessonJobData } from "../lib/queue";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

async function processJob(job: Job<GenerateLessonJobData>) {
  const { generationJobId, topic, level, userId } = job.data;
  console.log(`[worker] Starting job ${generationJobId}: "${topic}"`);

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "GENERATING_NARRATION", progressPct: 85 },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "RENDERING_VIDEO", progressPct: 90 },
  });

  const { videoKey, totalDurationSeconds } = await renderLessonVideo({
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    steps: generated.steps,
  });

  await prisma.video.create({
    data: {
      lessonId: lesson.id,
      storageUrl: videoKey,
      durationSec: totalDurationSeconds,
    },
  });

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: { durationMin: Math.round(totalDurationSeconds / 60) },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "COMPLETE", progressPct: 100 },
  });

  const generated = await generateLesson(topic, level);
  console.log(`[worker] ${generationJobId} -> Gemini returned "${generated.title}"`);

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "GENERATING_CODE", progressPct: 45 },
  });

  const category = await prisma.category.upsert({
    where: { slug: generated.category.toLowerCase().replace(/\s+/g, "-") },
    update: {},
    create: {
      name: generated.category,
      slug: generated.category.toLowerCase().replace(/\s+/g, "-"),
    },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "SPLITTING_STEPS", progressPct: 65 },
  });

  const totalDurationMin = Math.max(8, generated.steps.length * 4);
  let cumulativeSeconds = 0;

  const lesson = await prisma.lesson.create({
    data: {
      slug: slugify(generated.title),
      title: generated.title,
      description: generated.description,
      level,
      durationMin: totalDurationMin,
      isPrivate: false,
      categoryId: category.id,
      authorId: userId,
      generationJob: { connect: { id: generationJobId } },
      steps: {
        create: generated.steps.map((step, i) => {
          const timestampSec = cumulativeSeconds;
          cumulativeSeconds += 240; // placeholder 4 min per step until real video timing exists
          return {
            order: i + 1,
            timestampSec,
            title: step.title,
            code: step.code,
            explanation: step.explanation,
          };
        }),
      },
    },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "GENERATING_NARRATION", progressPct: 85 },
  });

  // Video narration/rendering (Remotion) plugs in here later.
  // For now, the lesson exists and is fully readable without a video.

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "COMPLETE", progressPct: 100 },
  });

  console.log(`[worker] ${generationJobId} COMPLETE -> lesson "${lesson.slug}"`);
}

const worker = new Worker<GenerateLessonJobData>(
  "lesson-generation",
  processJob,
  { connection: redisConnection }
);

worker.on("failed", async (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err);
  if (job?.data.generationJobId) {
    await prisma.generationJob.update({
      where: { id: job.data.generationJobId },
      data: { status: "FAILED", errorMessage: err.message },
    });
  }
});

console.log("[worker] Listening for lesson-generation jobs...");import "dotenv/config";
import { Worker, type Job } from "bullmq";
import { redisConnection } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { generateLesson } from "../lib/gemini";
import { renderLessonVideo } from "../lib/video";
import type { GenerateLessonJobData } from "../lib/queue";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

async function processJob(job: Job<GenerateLessonJobData>) {
  const { generationJobId, topic, level, userId } = job.data;
  console.log(`[worker] Starting job ${generationJobId}: "${topic}"`);

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "PLANNING", progressPct: 15 },
  });

  const generated = await generateLesson(topic, level);
  console.log(`[worker] ${generationJobId} -> Gemini returned "${generated.title}"`);

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "GENERATING_CODE", progressPct: 45 },
  });

  const category = await prisma.category.upsert({
    where: { slug: generated.category.toLowerCase().replace(/\s+/g, "-") },
    update: {},
    create: {
      name: generated.category,
      slug: generated.category.toLowerCase().replace(/\s+/g, "-"),
    },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "SPLITTING_STEPS", progressPct: 65 },
  });

  const totalDurationMin = Math.max(8, generated.steps.length * 4);
  let cumulativeSeconds = 0;

  const lesson = await prisma.lesson.create({
    data: {
      slug: slugify(generated.title),
      title: generated.title,
      description: generated.description,
      level,
      durationMin: totalDurationMin,
      isPrivate: false,
      categoryId: category.id,
      authorId: userId,
      generationJob: { connect: { id: generationJobId } },
      steps: {
        create: generated.steps.map((step, i) => {
          const timestampSec = cumulativeSeconds;
          cumulativeSeconds += 240; // placeholder until real video timing overwrites this below
          return {
            order: i + 1,
            timestampSec,
            title: step.title,
            code: step.code,
            explanation: step.explanation,
          };
        }),
      },
    },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "GENERATING_NARRATION", progressPct: 85 },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "RENDERING_VIDEO", progressPct: 90 },
  });

  const { videoKey, totalDurationSeconds } = await renderLessonVideo({
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    steps: generated.steps,
  });

  await prisma.video.create({
    data: {
      lessonId: lesson.id,
      storageUrl: videoKey,
      durationSec: totalDurationSeconds,
    },
  });

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: { durationMin: Math.round(totalDurationSeconds / 60) },
  });

  await prisma.generationJob.update({
    where: { id: generationJobId },
    data: { status: "COMPLETE", progressPct: 100 },
  });

  console.log(`[worker] ${generationJobId} COMPLETE -> lesson "${lesson.slug}"`);
}

const worker = new Worker<GenerateLessonJobData>(
  "lesson-generation",
  processJob,
  { connection: redisConnection }
);

worker.on("failed", async (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err);
  if (job?.data.generationJobId) {
    await prisma.generationJob.update({
      where: { id: job.data.generationJobId },
      data: { status: "FAILED", errorMessage: err.message },
    });
  }
});

console.log("[worker] Listening for lesson-generation jobs...");