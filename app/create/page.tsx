import { Suspense } from "react";
import CreateLessonForm from "@/components/CreateLessonForm";
import { PIPELINE_STEPS } from "@/lib/constants";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="gutter-line mb-4">{"// start here"}</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Create a lesson
      </h1>
      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-mist">
        Describe what you want to learn in your own words. LearnForge plans a
        real project, then teaches it back to you line by line in a narrated
        video.
      </p>

      <div className="mt-10">
        <Suspense fallback={null}>
          <CreateLessonForm />
        </Suspense>
      </div>

      {/* What happens next */}
      <div className="mt-14 border-t border-rule pt-10">
        <h2 className="gutter-line">what happens after you hit generate</h2>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {PIPELINE_STEPS.map((step) => (
            <div key={step.n} className="flex gap-3">
              <span className="font-mono text-sm text-teal">{step.n}</span>
              <div>
                <h3 className="font-display text-[14px] font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mist">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}