import Link from "next/link";
import type { MockLesson } from "@/lib/mock-data";

const LEVEL_COLOR: Record<MockLesson["level"], string> = {
  Beginner: "text-teal",
  Intermediate: "text-amber",
  Advanced: "text-ink",
};

export default function LessonCard({ lesson }: { lesson: MockLesson }) {
  return (
    <Link
      href={`/library/${lesson.id}`}
      className="group flex flex-col rounded-lg border border-rule bg-surface p-5 hover:border-teal/50 transition-colors"
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
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist">
        {lesson.description}
      </p>

      <div className="mt-5 flex items-center justify-between text-[12px]">
        <span
          className={`font-mono ${LEVEL_COLOR[lesson.level]}`}
        >
          {lesson.level}
        </span>
        <span className="text-mist-dim">by {lesson.author}</span>
      </div>

      <div className="mt-3 flex items-center gap-4 border-t border-rule pt-3 text-[12px] text-mist-dim">
        <span>♥ {lesson.likes}</span>
        <span>⑂ {lesson.remixes} remixes</span>
      </div>
    </Link>
  );
}