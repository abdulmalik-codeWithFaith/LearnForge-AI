"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { EXAMPLE_PROMPTS } from "@/lib/constants";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function CreateLessonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState(searchParams.get("topic") ?? "");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>(
    (searchParams.get("level") as (typeof LEVELS)[number]) || "Beginner"
  );
  const [isPrivate, setIsPrivate] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    const jobId = `job-${Date.now().toString(36)}`;
    const params = new URLSearchParams({
      topic: topic.trim(),
      level,
      private: String(isPrivate),
    });
    router.push(`/jobs/${jobId}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="rounded-lg border border-rule bg-surface p-4">
        <label htmlFor="topic" className="gutter-line">
          what do you want to learn
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
          placeholder='e.g. "Build a rate limiter in Node.js, and explain why token bucket beats a fixed window"'
          className="mt-3 w-full resize-none rounded-md bg-surface-raised px-4 py-3 text-[15px] text-ink placeholder:text-mist-dim outline-none ring-1 ring-transparent focus:ring-teal transition-shadow"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setTopic(prompt)}
              className="rounded-full border border-rule px-3 py-1.5 text-[12px] text-mist hover:border-teal/50 hover:text-ink transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Level + visibility */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="gutter-line">experience level</span>
          <div className="mt-3 flex rounded-lg border border-rule bg-surface p-1">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
                  level === l
                    ? "bg-amber text-canvas"
                    : "text-mist hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="gutter-line">visibility</span>
          <div className="mt-3 flex rounded-lg border border-rule bg-surface p-1">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
                !isPrivate ? "bg-teal text-canvas" : "text-mist hover:text-ink"
              }`}
            >
              Public — in the library
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
                isPrivate ? "bg-teal text-canvas" : "text-mist hover:text-ink"
              }`}
            >
              Private — just for me
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!topic.trim()}
        className="w-full rounded-md bg-amber py-3.5 text-[15px] font-semibold text-canvas hover:bg-amber-dim transition-colors disabled:opacity-50 sm:w-auto sm:self-start sm:px-8"
      >
        ▶ Generate lesson
      </button>
    </form>
  );
}