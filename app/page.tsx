import { Suspense } from "react";
import Link from "next/link";
import CodeTypingDemo from "@/components/Codetypingdemo";
import LessonRequestForm from "@/components/Lessonrequestform";
import { mockLessons } from "@/lib/mock-data";

const STEPS = [
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
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="gutter-line mb-4">{"// personalized learning, taught not told"}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
              Don&apos;t just get the code.
              <br />
              Watch it get <span className="text-amber">taught</span>.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">
              Describe what you want to learn. LearnForge builds a real
              project, then narrates it back to you — line by line, with the
              reasoning included.
            </p>

            <div className="mt-8">
              <Suspense fallback={null}>
                <LessonRequestForm />
              </Suspense>
            </div>
          </div>

          <CodeTypingDemo />
        </div>
      </section>

      {/* How it works — a genuine ordered pipeline, so numbering earns its place */}
      <section id="how-it-works" className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            How a lesson gets made
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-teal">{step.n}</span>
                <h3 className="mt-3 font-display text-[16px] font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library preview */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              From the library
            </h2>
            <Link
              href="/library"
              className="text-[14px] text-teal hover:text-ink transition-colors"
            >
              Browse all lessons →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockLessons.slice(0, 3).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/library/${lesson.id}`}
                className="group rounded-lg border border-rule bg-surface p-5 hover:border-teal/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-[11px] font-mono text-mist">
                    {lesson.category}
                  </span>
                  <span className="text-[11px] font-mono text-mist-dim">
                    {lesson.durationMin} min
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[15px] font-semibold text-ink group-hover:text-amber transition-colors">
                  {lesson.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">
                  {lesson.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-[12px] text-mist-dim">
                  <span>by {lesson.author}</span>
                  <span>♥ {lesson.likes}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}