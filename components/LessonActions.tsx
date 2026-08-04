"use client";

import { useState } from "react";

export default function LessonActions({
  initialLikes,
}: {
  initialLikes: number;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  function toggleLike() {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLike}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] transition-colors ${
          liked
            ? "border-amber/50 bg-amber/10 text-amber"
            : "border-rule text-mist hover:text-ink"
        }`}
      >
        <span>{liked ? "♥" : "♡"}</span>
        <span>{likes}</span>
      </button>

      <button
        type="button"
        onClick={() => setBookmarked((v) => !v)}
        className={`rounded-md border px-3 py-2 text-[13px] transition-colors ${
          bookmarked
            ? "border-teal/50 bg-teal/10 text-teal"
            : "border-rule text-mist hover:text-ink"
        }`}
      >
        {bookmarked ? "🔖 Saved" : "Bookmark"}
      </button>

      <button
        type="button"
        className="rounded-md border border-rule px-3 py-2 text-[13px] text-mist hover:text-ink transition-colors"
      >
        Share
      </button>
    </div>
  );
}