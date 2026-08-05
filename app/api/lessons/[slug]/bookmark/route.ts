import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

  const existing = await prisma.bookmark.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    });
  } else {
    await prisma.bookmark.create({
      data: { userId: session.user.id, lessonId: lesson.id },
    });
  }

  return NextResponse.json({ bookmarked: !existing });
}