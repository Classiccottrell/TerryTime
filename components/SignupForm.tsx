"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Couldn't sign you up. Try again in a moment.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border-2 border-forest bg-trueblack p-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-forest">YOU'RE IN.</p>
        <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-newsprint">
          Berry approved it. Watch your inbox for the next drop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label
        htmlFor="email"
        className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@eastvan.ca"
        className="w-full border-2 border-mediumdark bg-trueblack px-4 py-3 font-[family-name:var(--font-mono)] text-offwhite placeholder:text-gray focus:border-yellow"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full border-2 border-yellow bg-yellow px-6 py-3 font-[family-name:var(--font-display)] text-xl tracking-widest text-ink transition-transform hover:scale-[0.99] disabled:opacity-70"
      >
        {status === "loading" ? "SIGNING YOU UP…" : "JOIN THE COLLECTIVE"}
      </button>
      {error && (
        <p className="font-[family-name:var(--font-spacemono)] text-xs text-red">{error}</p>
      )}
      <p className="font-[family-name:var(--font-spacemono)] text-xs text-gray">
        Free. Unsubscribe whenever. The Editor hates spam more than you do.
      </p>
    </form>
  );
}
