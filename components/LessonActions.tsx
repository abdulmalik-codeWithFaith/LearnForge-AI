"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function LessonActions({
  slug,
  initialLikes,
  initialLiked,
  initialBookmarked,
}: {
  slug: string;
  initialLikes: number;
  initialLiked: boolean;
  initialBookmarked: boolean;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!session) {
      signIn();
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/lessons/${slug}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.likes);
    }
    setLoading(false);
  }

  async function toggleBookmark() {
    if (!session) {
      signIn();
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/lessons/${slug}/bookmark`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLike}
        disabled={loading}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] transition-colors disabled:opacity-50 ${
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
        onClick={toggleBookmark}
        disabled={loading}
        className={`rounded-md border px-3 py-2 text-[13px] transition-colors disabled:opacity-50 ${
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