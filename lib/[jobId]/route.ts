import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { jobId } = await params;

  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: { lesson: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.userId !== session.user.id) {
    return NextResponse.json({ error: "Not your job" }, { status: 403 });
  }

  return NextResponse.json({
    id: job.id,
    topic: job.topic,
    level: job.level,
    status: job.status,
    progressPct: job.progressPct,
    errorMessage: job.errorMessage,
    lessonSlug: job.lesson?.slug ?? null,
  });
}