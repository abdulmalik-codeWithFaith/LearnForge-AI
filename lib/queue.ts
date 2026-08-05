import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export type GenerateLessonJobData = {
  generationJobId: string;
  topic: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  userId: string;
};

export const lessonQueue = new Queue<GenerateLessonJobData>("lesson-generation", {
  connection: redisConnection,
});