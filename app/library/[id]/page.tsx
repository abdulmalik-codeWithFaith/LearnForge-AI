import Link from "next/link";
import { notFound } from "next/navigation";
import LessonActions from "@/components/LessonActions";
import CommentSection from "@/components/CommentSection";
import {
  getLessonById,
  getLessonSteps,
  getLessonComments,
} from "@/lib/mock-data";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const steps = getLessonSteps(lesson);
  const comments = getLessonComments(lesson);

  const remixParams = new URLSearchParams({
    topic: lesson.title,
    level: lesson.level,
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="gutter-line mb-4">
        <Link href="/library" className="hover:text-ink transition-colors">
          Library
        </Link>{" "}
        / {lesson.category}
      </p>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-mist">
            {lesson.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-mist-dim">
            <span>by {lesson.author}</span>
            <span>·</span>
            <span>{lesson.level}</span>
            <span>·</span>
            <span>{lesson.durationMin} min</span>
            <span>·</span>
            <span>⑂ {lesson.remixes} remixes</span>
          </div>
        </div>
        <LessonActions initialLikes={lesson.likes} />
      </div>

      {/* Video placeholder */}
      <div className="mt-8 flex aspect-video items-center justify-center rounded-lg border border-rule bg-surface">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-amber text-canvas hover:bg-amber-dim transition-colors"
            aria-label="Play lesson video"
          >
            ▶
          </button>
          <span className="gutter-line">
            {lesson.durationMin} min narrated walkthrough
          </span>
        </div>
      </div>

      {/* Remix CTA */}
      <div className="mt-6 flex items-center justify-between rounded-lg border border-rule bg-surface px-5 py-4">
        <p className="text-[14px] text-mist">
          Want your own version of this lesson, tailored to your level?
        </p>
        <Link
          href={`/?${remixParams.toString()}#generate`}
          className="whitespace-nowrap rounded-md bg-teal px-4 py-2 text-[13px] font-semibold text-canvas hover:bg-teal-dim transition-colors"
        >
          ⑂ Generate my version
        </Link>
      </div>

      {/* Steps */}
      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          What this lesson teaches, step by step
        </h2>
        <div className="mt-6 flex flex-col gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="rounded-lg border border-rule bg-surface overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-teal">
                    {String(step.order).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-medium text-ink">
                    {step.title}
                  </span>
                </div>
                <span className="gutter-line">{step.timestamp}</span>
              </div>
              <pre className="code-scroll overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 text-ink">
                {step.code}
              </pre>
              <p className="border-t border-rule bg-surface-raised px-4 py-3 text-[13px] leading-relaxed text-mist">
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Comments
        </h2>
        <div className="mt-6">
          <CommentSection initialComments={comments} />
        </div>
      </div>
    </div>
  );
}