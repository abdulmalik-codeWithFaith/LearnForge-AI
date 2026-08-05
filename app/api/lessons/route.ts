import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const lessons = await prisma.lesson.findMany({
    where: { isPrivate: false },
    include: {
      category: true,
      author: true,
      _count: {
        select: { likes: true, remixes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Shape the response to match what LessonCard.tsx currently expects
  // from mock-data.ts (title, description, category, level, author, etc.)
  const shaped = lessons.map((lesson) => ({
    id: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    category: lesson.category.name,
    level: lesson.level,
    author: lesson.author.username,
    durationMin: lesson.durationMin,
    likes: lesson._count.likes,
    remixes: lesson._count.remixes,
  }));

  return NextResponse.json(shaped);
}