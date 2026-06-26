import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-[family-name:var(--font-display)] text-8xl sm:text-9xl text-yellow leading-none">
        404
      </p>
      <p className="mt-4 font-[family-name:var(--font-mono)] text-lg italic text-newsprint">
        “It's not here. Cut it.” — Berry, the Editor
      </p>
      <p className="mt-2 font-[family-name:var(--font-serif)] text-xl text-gray">
        This page got edited out of existence.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border-2 border-yellow px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-widest text-yellow hover:bg-yellow hover:text-ink transition-colors"
      >
        BACK TO THE STUDIO
      </Link>
    </div>
  );
}
