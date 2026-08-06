"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { n: "02", href: "/library", label: "Library" },
  { n: "03", href: "/#how-it-works", label: "How it works" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-rule bg-canvas/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="gutter-line group-hover:text-teal transition-colors">
            01
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            LearnForge
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <Link key={l.n} href={l.href} className="group flex items-center gap-2">
              <span className="gutter-line group-hover:text-teal transition-colors">
                {l.n}
              </span>
              <span className="text-[14px] text-mist group-hover:text-ink transition-colors">
                {l.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/login" className="text-[14px] text-mist hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            href="/create"
            className="rounded-md bg-amber px-4 py-2 text-[14px] font-semibold text-canvas hover:bg-amber-dim transition-colors"
          >
            Generate a lesson
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink sm:hidden"
        >
          <span className="font-mono text-[16px]">{open ? "✕" : "≡"}</span>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-rule px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.n}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2"
              >
                <span className="gutter-line group-hover:text-teal transition-colors">
                  {l.n}
                </span>
                <span className="text-[14px] text-mist group-hover:text-ink transition-colors">
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3 border-t border-rule pt-4">
            <Link href="/login" className="text-left text-[14px] text-mist hover:text-ink transition-colors">
              Sign in
            </Link>
            <Link
              href="/create"
              onClick={() => setOpen(false)}
              className="rounded-md bg-amber px-4 py-2.5 text-center text-[14px] font-semibold text-canvas hover:bg-amber-dim transition-colors"
            >
              Generate a lesson
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}