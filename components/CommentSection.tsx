"use client";

import { useState } from "react";
import type { MockComment } from "@/lib/mock-data";

export default function CommentSection({
  initialComments,
}: {
  initialComments: MockComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");

  function handlePost() {
    if (!draft.trim()) return;
    setComments((prev) => [
      {
        id: `local-${Date.now()}`,
        author: "you",
        body: draft.trim(),
        createdAgo: "just now",
      },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePost()}
          placeholder="Add a comment…"
          className="flex-1 rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink placeholder:text-mist-dim outline-none ring-1 ring-transparent focus:ring-teal transition-shadow"
        />
        <button
          type="button"
          onClick={handlePost}
          disabled={!draft.trim()}
          className="rounded-md bg-amber px-4 py-2.5 text-[13px] font-semibold text-canvas hover:bg-amber-dim transition-colors disabled:opacity-50"
        >
          Post
        </button>
      </div>

      <ul className="mt-6 flex flex-col gap-5">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-surface-raised" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-ink">
                  {c.author}
                </span>
                <span className="text-[12px] text-mist-dim">
                  {c.createdAgo}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-mist">
                {c.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}