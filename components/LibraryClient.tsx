"use client";

import { useMemo, useState } from "react";
import type { ExperienceLevel, MockLesson } from "@/lib/mock-data";
import LessonCard from "@/components/LessonCard";

const LEVELS: Array<ExperienceLevel | "All"> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function LibraryClient({ lessons }: { lessons: MockLesson[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(lessons.map((l) => l.category)));
    return ["All", ...unique];
  }, [lessons]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const matchesQuery =
        q.length === 0 ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.author.toLowerCase().includes(q);
      const matchesCategory = category === "All" || lesson.category === category;
      const matchesLevel = level === "All" || lesson.level === level;
      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [query, category, level, lessons]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="gutter-line mb-4">{`// ${lessons.length} lessons and counting`}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Library
          </h1>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-mist">
            Every public lesson someone has generated. Watch one, or remix it
            into your own personalized version.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-lg border border-rule bg-surface p-4 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, topics, authors…"
          className="flex-1 rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink placeholder:text-mist-dim outline-none ring-1 ring-transparent focus:ring-teal transition-shadow"
        />

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-mono transition-colors ${
                category === c
                  ? "bg-amber text-canvas"
                  : "bg-surface-raised text-mist hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="sm:ml-auto">
          <span className="sr-only">Experience level</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
            className="w-full appearance-none rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink outline-none ring-1 ring-transparent focus:ring-teal transition-shadow sm:w-44"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All levels" : l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="gutter-line">
          {results.length} result{results.length === 1 ? "" : "s"}
        </span>
        {(query || category !== "All" || level !== "All") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setLevel("All");
            }}
            className="text-[13px] text-teal hover:text-ink transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-rule py-16 text-center">
          <p className="text-[14px] text-mist">
            No lessons match those filters yet.
          </p>
          <p className="mt-1 text-[13px] text-mist-dim">
            Try a different search, or be the first to generate one.
          </p>
        </div>
      )}
    </div>
  );
}