"use client";

import { useEffect, useState } from "react";

type Frame = {
  code: string;
  narration: string;
};

const SCRIPT: Frame[] = [
  { code: "class TokenBucket {", narration: "First, a place to hold state." },
  {
    code: "  constructor(capacity, refillPerSec) {",
    narration: "Two knobs: how big the bucket is, and how fast it refills.",
  },
  {
    code: "    this.capacity = capacity;",
    narration: "The max number of requests we'll ever allow in a burst.",
  },
  {
    code: "    this.tokens = capacity;",
    narration: "We start full — nobody's been throttled yet.",
  },
  {
    code: "    this.refillPerSec = refillPerSec;",
    narration: "Tokens trickle back in over time, not all at once.",
  },
  { code: "  }", narration: "" },
  { code: "", narration: "" },
  {
    code: "  take(n = 1) {",
    narration: "Every request calls take() before it's allowed through.",
  },
  {
    code: "    this.refill();",
    narration: "Catch the bucket up first, based on elapsed time.",
  },
  {
    code: "    if (this.tokens < n) return false;",
    narration: "Not enough tokens? Reject — this is the actual limiting.",
  },
  {
    code: "    this.tokens -= n;",
    narration: "Otherwise, spend the tokens and let it through.",
  },
  { code: "    return true;", narration: "" },
  { code: "  }", narration: "" },
  { code: "}", narration: "That's a rate limiter. Nine lines that matter." },
];

export default function CodeTypingDemo() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setVisibleCount(SCRIPT.length);
      return;
    }

    const interval = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= SCRIPT.length) {
          return 1;
        }
        return count + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const visibleLines = SCRIPT.slice(0, visibleCount);
  const currentNarration =
    [...visibleLines].reverse().find((f) => f.narration)?.narration ?? "";

  return (
    <div className="rounded-lg border border-rule bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal" />
        </div>
        <span className="gutter-line">rate-limiter.js — lesson 04 / 12</span>
      </div>

      <div className="code-scroll overflow-y-auto px-0 py-3" style={{ maxHeight: 260 }}>
        {visibleLines.map((frame, i) => {
          const isLast = i === visibleLines.length - 1;
          return (
            <div
              key={i}
              className={`flex gap-4 px-4 py-0.5 font-mono text-[13px] leading-6 ${
                isLast && !reducedMotion ? "bg-amber/10" : ""
              }`}
            >
              <span className="w-5 shrink-0 text-right text-mist-dim select-none">
                {i + 1}
              </span>
              <span className="whitespace-pre text-ink">
                {frame.code}
                {isLast && !reducedMotion && (
                  <span className="caret text-teal">▍</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 border-t border-rule bg-surface-raised px-4 py-3">
        <span className="mt-0.5 text-teal">▶</span>
        <p className="text-[13px] text-mist min-h-[1.25rem]">
          {currentNarration || "\u00A0"}
        </p>
      </div>
    </div>
  );
}