import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { lessonQueue } from "@/lib/queue";

const LEVEL_MAP = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { topic, level, isPrivate } = await request.json();

  if (!topic || !topic.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const mappedLevel = LEVEL_MAP[level as keyof typeof LEVEL_MAP];
  if (!mappedLevel) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  const generationJob = await prisma.generationJob.create({
    data: {
      userId: session.user.id,
      topic: topic.trim(),
      level: mappedLevel,
      status: "QUEUED",
      progressPct: 0,
    },
  });

  await lessonQueue.add("generate-lesson", {
    generationJobId: generationJob.id,
    topic: topic.trim(),
    level: mappedLevel,
    userId: session.user.id,
  });

  return NextResponse.json({ jobId: generationJob.id });
}