export const PIPELINE_STEPS = [
  {
    n: "01",
    title: "Describe what you want to learn",
    body: "Type a topic in plain language and pick your level — beginner, intermediate, or advanced.",
  },
  {
    n: "02",
    title: "LearnForge plans and builds it",
    body: "A complete, working project gets generated behind the scenes before a single teaching frame is made.",
  },
  {
    n: "03",
    title: "The project is split into steps",
    body: "The code is broken into small, ordered teaching moments — the same way a good tutor would pace a lesson.",
  },
  {
    n: "04",
    title: "You watch it get taught",
    body: "A narrated video plays the code in line by line, explaining the reasoning as each piece appears.",
  },
] as const;

export const EXAMPLE_PROMPTS = [
  "Build a rate limiter in Node.js",
  "Explain useState with real examples",
  "Read a Postgres query plan",
  "Python decorators from first principles",
  "A CSS Grid dashboard layout",
  "Background jobs with BullMQ",
] as const;