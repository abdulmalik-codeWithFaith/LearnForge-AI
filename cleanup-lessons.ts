import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const lessonsWithoutVideo = await prisma.lesson.findMany({
    where: { video: null },
    select: { id: true, slug: true, title: true },
  });

  console.log(`Found ${lessonsWithoutVideo.length} lesson(s) with no video:`);
  lessonsWithoutVideo.forEach((l) => console.log(`  - ${l.slug} ("${l.title}")`));

  if (lessonsWithoutVideo.length === 0) {
    console.log("Nothing to delete.");
    process.exit(0);
  }

  const ids = lessonsWithoutVideo.map((l) => l.id);

  await prisma.lesson.deleteMany({
    where: { id: { in: ids } },
  });

  console.log(`Deleted ${ids.length} lesson(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});