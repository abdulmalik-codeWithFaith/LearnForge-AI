export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="gutter-line">
          // learnforge-ai — every lesson starts as a plan, ends as a video
        </p>
        <p className="text-[13px] text-mist-dim">
          © {new Date().getFullYear()} LearnForge AI
        </p>
      </div>
    </footer>
  );
}