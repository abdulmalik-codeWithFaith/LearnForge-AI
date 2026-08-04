import "dotenv/config";
import { PrismaClient, ExperienceLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ...unchanged
  const user = await prisma.user.upsert({
    where: { email: "demo@learnforge.ai" },
    update: {},
    create: {
      email: "demo@learnforge.ai",
      username: "priya.codes",
      name: "Priya",
    },
  });

  const backend = await prisma.category.upsert({
    where: { slug: "backend" },
    update: {},
    create: { name: "Backend", slug: "backend" },
  });

  const lesson = await prisma.lesson.upsert({
    where: { slug: "rate-limiter-node" },
    update: {},
    create: {
      slug: "rate-limiter-node",
      title: "Build a token-bucket rate limiter",
      description:
        "From empty file to a working Express middleware, explained line by line.",
      level: ExperienceLevel.INTERMEDIATE,
      durationMin: 18,
      categoryId: backend.id,
      authorId: user.id,
      steps: {
        create: [
          {
            order: 1,
            timestampSec: 0,
            title: "Set up the bucket's state",
            code: "class TokenBucket {\n  constructor(capacity, refillPerSec) {\n    this.capacity = capacity;\n    this.tokens = capacity;\n    this.refillPerSec = refillPerSec;\n  }\n}",
            explanation:
              "Every rate limiter needs somewhere to track how much allowance is left. We start full, so nobody is throttled before they've made a single request.",
          },
          {
            order: 2,
            timestampSec: 200,
            title: "Refill tokens based on elapsed time",
            code: "refill() {\n  const now = Date.now();\n  const elapsed = (now - this.lastRefill) / 1000;\n  const refreshed = elapsed * this.refillPerSec;\n  this.tokens = Math.min(this.capacity, this.tokens + refreshed);\n  this.lastRefill = now;\n}",
            explanation:
              "Instead of a timer running in the background, we calculate how many tokens should have regenerated since we last checked.",
          },
        ],
      },
    },
  });

  console.log("Seeded:", lesson.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });