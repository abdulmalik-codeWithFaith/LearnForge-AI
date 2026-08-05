import { Type } from "@google/genai";

export const lessonResponseSchema = {
  type: Type.OBJECT,
  required: ["title", "description", "category", "steps"],
  properties: {
    title: { type: Type.STRING, description: "A concise, compelling lesson title" },
    description: {
      type: Type.STRING,
      description: "1-2 sentence summary of what this lesson teaches",
    },
    category: {
      type: Type.STRING,
      description: "One short category name, e.g. 'Backend', 'Frontend', 'Python', 'Databases'",
    },
    steps: {
      type: Type.ARRAY,
      description: "4 to 7 ordered teaching steps that build the project incrementally",
      items: {
        type: Type.OBJECT,
        required: ["title", "code", "explanation"],
        properties: {
          title: {
            type: Type.STRING,
            description: "Short title for this step, e.g. 'Set up the bucket's state'",
          },
          code: {
            type: Type.STRING,
            description: "The actual code for this step, real and runnable, not pseudocode",
          },
          explanation: {
            type: Type.STRING,
            description: "2-4 sentences explaining the reasoning behind this code, teaching-tone",
          },
        },
      },
    },
  },
};