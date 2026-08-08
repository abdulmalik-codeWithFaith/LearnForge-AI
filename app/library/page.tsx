import { prisma } from "@/lib/prisma";
import LibraryClient from "@/components/LibraryClient";
export const dynamic = "force-dynamic";
const LEVEL_LABELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

export default async function LibraryPage() {
  const lessons = await prisma.lesson.findMany({
    where: { isPrivate: false },
    include: {
      category: true,
      author: true,
      _count: { select: { likes: true, remixes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const shaped = lessons.map((lesson) => ({
    id: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    category: lesson.category.name,
    level: LEVEL_LABELS[lesson.level],
    author: lesson.author.username,
    durationMin: lesson.durationMin,
    likes: lesson._count.likes,
    remixes: lesson._count.remixes,
  }));

  return <LibraryClient lessons={shaped} />;
}