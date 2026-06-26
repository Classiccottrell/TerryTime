import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-[family-name:var(--font-display)] text-8xl sm:text-[12rem] text-red leading-none tracking-tight">
        404
      </p>
      <p className="mt-4 font-[family-name:var(--font-mono)] text-lg italic text-stone">
        “It's not here. Cut it.” — Berry, the Editor
      </p>
      <p className="mt-2 font-[family-name:var(--font-serif)] text-xl text-ink">
        This page got edited out of existence.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-ink text-paper px-8 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest hover:bg-red transition-colors"
      >
        Back to the Studio
      </Link>
    </div>
  );
}
