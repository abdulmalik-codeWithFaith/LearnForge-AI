import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <div className="w-full max-w-md rounded-lg border border-rule bg-surface overflow-hidden text-left">
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          </div>
          <span className="gutter-line">404.js</span>
        </div>
        <div className="px-4 py-4 font-mono text-[13px] leading-6">
          <div className="flex gap-4">
            <span className="w-5 shrink-0 text-right text-mist-dim select-none">1</span>
            <span className="text-mist-dim">{"// this page doesn't exist"}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-5 shrink-0 text-right text-mist-dim select-none">2</span>
            <span className="text-ink">
              <span className="text-amber">throw</span> new NotFoundError
              <span className="caret text-teal">▍</span>
            </span>
          </div>
        </div>
      </div>

      <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">
        Nothing here yet
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-mist">
        The lesson, job, or page you&apos;re looking for doesn&apos;t exist
        — or hasn&apos;t been generated.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-amber px-4 py-2.5 text-[13px] font-semibold text-canvas hover:bg-amber-dim transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/library"
          className="rounded-md border border-rule px-4 py-2.5 text-[13px] text-mist hover:text-ink transition-colors"
        >
          Browse library
        </Link>
      </div>
    </div>
  );
}