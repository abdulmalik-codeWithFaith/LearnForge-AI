"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentSection({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!draft.trim()) return;
    if (!session) {
      signIn();
      return;
    }

    setPosting(true);
    const res = await fetch(`/api/lessons/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft.trim() }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setDraft("");
    }
    setPosting(false);
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
          disabled={!draft.trim() || posting}
          className="rounded-md bg-amber px-4 py-2.5 text-[13px] font-semibold text-canvas hover:bg-amber-dim transition-colors disabled:opacity-50"
        >
          {posting ? "..." : "Post"}
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
                  {timeAgo(c.createdAt)}
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