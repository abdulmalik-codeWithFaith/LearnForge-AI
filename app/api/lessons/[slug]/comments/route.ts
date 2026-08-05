import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { lessonId: lesson.id },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      author: c.author.username,
      body: c.body,
      createdAt: c.createdAt,
    }))
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const { body } = await request.json();
  if (!body || !body.trim()) {
    return NextResponse.json({ error: "Comment can't be empty" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { body: body.trim(), lessonId: lesson.id, authorId: session.user.id },
    include: { author: true },
  });

  return NextResponse.json({
    id: comment.id,
    author: comment.author.username,
    body: comment.body,
    createdAt: comment.createdAt,
  });
}