"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type JobStatus =
  | "QUEUED"
  | "PLANNING"
  | "GENERATING_CODE"
  | "SPLITTING_STEPS"
  | "GENERATING_NARRATION"
  | "RENDERING_VIDEO"
  | "COMPLETE"
  | "FAILED";

type JobData = {
  id: string;
  topic: string;
  level: string;
  status: JobStatus;
  progressPct: number;
  errorMessage: string | null;
  lessonSlug: string | null;
};

const STAGES: Array<{ key: JobStatus; label: string }> = [
  { key: "QUEUED", label: "Queued" },
  { key: "PLANNING", label: "Planning lesson" },
  { key: "GENERATING_CODE", label: "Generating project" },
  { key: "SPLITTING_STEPS", label: "Splitting into steps" },
  { key: "GENERATING_NARRATION", label: "Writing narration" },
  { key: "RENDERING_VIDEO", label: "Rendering video" },
  { key: "COMPLETE", label: "Ready to watch" },
];

export default function JobStatusView({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobData | null>(null);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Something went wrong.");
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        const data: JobData = await res.json();
        setJob(data);

        if (data.status === "COMPLETE" || data.status === "FAILED") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        setError("Lost connection while checking progress.");
      }
    }

    poll();
    intervalRef.current = setInterval(poll, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[14px] text-mist">{error}</p>
        <Link href="/create" className="mt-3 inline-block text-[13px] text-teal hover:text-ink transition-colors">
          Start a new lesson →
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="gutter-line">loading…</p>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === job.status);
  const isFailed = job.status === "FAILED";
  const isComplete = job.status === "COMPLETE";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="gutter-line mb-4">{`// ${job.id}`}</p>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {job.topic}
          </h1>
          <p className="mt-2 text-[13px] text-mist-dim">
            {job.level} · generating from your request
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="gutter-line">
            {isFailed ? "failed" : `${job.progressPct}%`}
          </span>
          <span className="gutter-line">
            {isFailed ? job.errorMessage : STAGES[currentIndex]?.label}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isFailed ? "bg-red-500" : "bg-amber"
            }`}
            style={{ width: `${isFailed ? 100 : job.progressPct}%` }}
          />
        </div>
      </div>

      {/* Stage tracker */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAGES.map((s, i) => {
          const isDone = !isFailed && (isComplete || currentIndex > i);
          const isCurrent = !isFailed && currentIndex === i && !isComplete;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                  isDone
                    ? "bg-teal text-canvas"
                    : isCurrent
                      ? "bg-amber text-canvas animate-pulse"
                      : "bg-surface-raised text-mist-dim"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className={`text-[12px] ${isCurrent ? "text-ink" : "text-mist-dim"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Failure state */}
      {isFailed && (
        <div className="mt-8 rounded-lg border border-dashed border-rule px-5 py-8 text-center">
          <p className="text-[14px] text-mist">Generation failed.</p>
          {job.errorMessage && (
            <p className="mt-1 text-[13px] text-mist-dim">{job.errorMessage}</p>
          )}
          <Link href="/create" className="mt-3 inline-block text-[13px] text-teal hover:text-ink transition-colors">
            Try again →
          </Link>
        </div>
      )}

      {/* Completion state */}
      {isComplete && (
        <div className="mt-8 rounded-lg border border-teal/40 bg-teal/5 px-5 py-6">
          {job.lessonSlug ? (
            <>
              <p className="text-[14px] text-ink">Your lesson is ready.</p>
              <Link
                href={`/library/${job.lessonSlug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-[13px] font-semibold text-canvas hover:bg-teal-dim transition-colors"
              >
                ▶ Watch your lesson
              </Link>
            </>
          ) : (
            <p className="text-[14px] text-ink">
              Generation pipeline complete. (Real lesson creation isn&apos;t wired up
              yet — that&apos;s the next step, connecting actual AI generation.)
            </p>
          )}
        </div>
      )}
    </div>
  );
}