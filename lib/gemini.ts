import { GoogleGenAI } from "@google/genai";
import { lessonResponseSchema } from "./lesson-schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type GeneratedLesson = {
  title: string;
  description: string;
  category: string;
  steps: Array<{ title: string; code: string; explanation: string }>;
};

export async function generateLesson(
  topic: string,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
): Promise<GeneratedLesson> {
  const prompt = `You are an expert programming tutor creating a personalized video-lesson script.

The learner wants to learn: "${topic}"
Their experience level: ${level}

Design a small, real, working project that teaches this. Break it into 4-7 ordered steps that build the project incrementally, the way a good tutor would pace a lesson — starting from nothing, ending with a working result. Each step must include real, correct, runnable code (not pseudocode) and a clear explanation of the reasoning behind it, pitched at a ${level.toLowerCase()} learner.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: lessonResponseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(text) as GeneratedLesson;
}