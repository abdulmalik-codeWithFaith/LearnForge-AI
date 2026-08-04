"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mockLessons } from "@/lib/mock-data";

type StageKey = "queued" | "generating" | "rendering" | "complete";

const STAGES: Array<{ key: StageKey; label: string; atPct: number }> = [
  { key: "queued", label: "Queued", atPct: 0 },
  { key: "generating", label: "Generating project & lesson plan", atPct: 10 },
  { key: "rendering", label: "Rendering narrated video", atPct: 70 },
  { key: "complete", label: "Ready to watch", atPct: 100 },
];

const LOG_SCRIPT: Array<{ atPct: number; text: string }> = [
  { atPct: 0, text: "job queued" },
  { atPct: 5, text: "worker picked up job" },
  { atPct: 12, text: "planning lesson from request" },
  { atPct: 28, text: "generating project files" },
  { atPct: 45, text: "splitting project into teaching steps" },
  { atPct: 58, text: "writing narration script" },
  { atPct: 70, text: "rendering: compositing code animation" },
  { atPct: 85, text: "rendering: mixing narration audio" },
  { atPct: 96, text: "uploading to storage" },
  { atPct: 100, text: "lesson ready" },
];

function stageForPct(pct: number): StageKey {
  let current: StageKey = "queued";
  for (const s of STAGES) {
    if (pct >= s.atPct) current = s.key;
  }
  return current;
}

function pickDemoLesson(jobId: string) {
  const hash = Array.from(jobId).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return mockLessons[hash % mockLessons.length];
}

export default function JobStatusView({ jobId }: { jobId: string }) {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "your lesson";
  const level = searchParams.get("level") || "Beginner";
  const isPrivate = searchParams.get("private") === "true";

  const [pct, setPct] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;
    if (pct >= 100) return;

    const timer = setInterval(() => {
      setPct((p) => Math.min(100, p + 2));
    }, 240);

    return () => clearInterval(timer);
  }, [cancelled, pct]);

  const log = LOG_SCRIPT.filter((entry) => pct >= entry.atPct).map(
    (entry) => entry.text
  );

  const stage = cancelled ? null : stageForPct(pct);
  const demoLesson = pickDemoLesson(jobId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="gutter-line mb-4">{`// ${jobId}`}</p>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {topic}
          </h1>
          <p className="mt-2 text-[13px] text-mist-dim">
            {level} · {isPrivate ? "private" : "public"} · generating from
            your request
          </p>
        </div>
        {!cancelled && pct < 100 && (
          <button
            type="button"
            onClick={() => setCancelled(true)}
            className="rounded-md border border-rule px-3 py-2 text-[13px] text-mist hover:text-ink transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="gutter-line">
            {cancelled ? "cancelled" : `${pct}%`}
          </span>
          <span className="gutter-line">
            {cancelled ? "" : STAGES.find((s) => s.key === stage)?.label}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              cancelled ? "bg-mist-dim" : "bg-amber"
            }`}
            style={{ width: `${cancelled ? pct : pct}%` }}
          />
        </div>
      </div>

      {/* Stage tracker — reuses the numbered-step motif from the homepage */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAGES.map((s, i) => {
          const currentIndex = STAGES.findIndex((x) => x.key === stage);
          const isFinal = !cancelled && s.key === "complete" && pct >= 100;
          const isDone = !cancelled && !isFinal && currentIndex > i;
          const isCurrent = !cancelled && currentIndex === i && pct < 100;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                  isFinal || isDone
                    ? "bg-teal text-canvas"
                    : isCurrent
                      ? "bg-amber text-canvas animate-pulse"
                      : "bg-surface-raised text-mist-dim"
                }`}
              >
                {isFinal || isDone ? "✓" : i + 1}
              </span>
              <span
                className={`text-[12px] ${
                  isCurrent ? "text-ink" : "text-mist-dim"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal-style log feed */}
      <div className="mt-8 rounded-lg border border-rule bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal" />
          </div>
          <span className="gutter-line">build log</span>
        </div>
        <div className="code-scroll overflow-y-auto px-4 py-3" style={{ maxHeight: 220 }}>
          {log.map((line, i) => (
            <div key={i} className="flex gap-3 py-0.5 font-mono text-[13px]">
              <span className="text-mist-dim">{`[${String(i + 1).padStart(2, "0")}]`}</span>
              <span className="text-mist">{line}</span>
            </div>
          ))}
          {!cancelled && pct < 100 && (
            <div className="flex gap-3 py-0.5 font-mono text-[13px]">
              <span className="text-mist-dim">{`[${String(log.length + 1).padStart(2, "0")}]`}</span>
              <span className="caret text-teal">▍</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion / cancellation states */}
      {cancelled && (
        <div className="mt-8 rounded-lg border border-dashed border-rule px-5 py-8 text-center">
          <p className="text-[14px] text-mist">Generation cancelled.</p>
          <Link
            href="/create"
            className="mt-3 inline-block text-[13px] text-teal hover:text-ink transition-colors"
          >
            Start a new lesson →
          </Link>
        </div>
      )}

      {!cancelled && pct >= 100 && (
        <div className="mt-8 rounded-lg border border-teal/40 bg-teal/5 px-5 py-6">
          <p className="text-[14px] text-ink">
            Your lesson is ready. Since this is a UI-only demo, here&apos;s a
            finished example lesson in its place:
          </p>
          <Link
            href={`/library/${demoLesson.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-[13px] font-semibold text-canvas hover:bg-teal-dim transition-colors"
          >
            ▶ Watch &ldquo;{demoLesson.title}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}