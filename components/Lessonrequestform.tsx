"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function LessonRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>(
    (searchParams.get("level") as (typeof LEVELS)[number]) || "Beginner"
  );

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  if (!topic.trim()) return;

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topic.trim(), level, isPrivate: false }),
  });

  if (!res.ok) {
    const data = await res.json();
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    alert(data.error ?? "Something went wrong.");
    return;
  }

  const { jobId } = await res.json();
  router.push(`/jobs/${jobId}`);
}

  return (
    <div>
      <form
        id="generate"
        onSubmit={handleSubmit}
        className="rounded-lg border border-rule bg-surface p-2"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label className="flex-1">
            <span className="sr-only">What do you want to learn?</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='e.g. "Build a rate limiter in Node.js"'
              className="w-full rounded-md bg-surface-raised px-4 py-3 text-[14px] text-ink placeholder:text-mist-dim outline-none ring-1 ring-transparent focus:ring-teal transition-shadow"
            />
          </label>

          <label className="relative">
            <span className="sr-only">Experience level</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              className="h-full w-full sm:w-40 appearance-none rounded-md bg-surface-raised px-4 py-3 text-[14px] text-ink outline-none ring-1 ring-transparent focus:ring-teal transition-shadow"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="whitespace-nowrap rounded-md bg-amber px-5 py-3 text-[14px] font-semibold text-canvas hover:bg-amber-dim transition-colors disabled:opacity-50"
            disabled={!topic.trim()}
          >
            ▶ Generate lesson
          </button>
        </div>
      </form>
      <p className="mt-3 text-[13px] text-mist-dim">
        Want more room, examples, and privacy options?{" "}
        <Link href="/create" className="text-teal hover:text-ink transition-colors">
          Open the full create page →
        </Link>
      </p>
    </div>
  );
}