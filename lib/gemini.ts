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

Design a small, real, working project that teaches this. Break it into 4-7 ordered steps that build the project incrementally, the way a good tutor would pace a lesson — starting from nothing, ending with a working result.

For each step's code:
- Write it exactly as it would appear in a real code editor: real line breaks between statements/rules/lines, consistent 2-space indentation, no minifying or cramming multiple statements onto one line.
- Keep each step's code short enough to read comfortably on a video frame — ideally under 12 lines. If a step would need more, simplify or split it into two steps instead.
- The code must be real and correct for the language, not pseudocode.

Each step also needs a clear explanation (2-4 sentences) of the reasoning behind that code, pitched at a ${level.toLowerCase()} learner.`;

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