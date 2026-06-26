"use client";

import { useState } from "react";
import { isStaticExport } from "@/lib/site";

type Status = "idle" | "loading" | "done" | "error";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (isStaticExport) {
      // No backend on a static host — acknowledge without a dead request.
      setStatus("done");
      return;
    }
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
      <div className="border-2 border-forest bg-paper p-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-forest">
          YOU'RE IN.
        </p>
        <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-stone">
          Berry approved it. Watch your inbox for the next drop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="email" className="eyebrow block text-stone">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@eastvan.ca"
        className="w-full border border-ink bg-cloud px-4 py-3 font-[family-name:var(--font-mono)] text-ink placeholder:text-stone focus:bg-paper focus:border-red outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-ink px-6 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-paper transition-colors hover:bg-red disabled:opacity-70"
      >
        {status === "loading" ? "Signing you up…" : "Join the Collective"}
      </button>
      {error && (
        <p className="font-[family-name:var(--font-spacemono)] text-xs text-red">{error}</p>
      )}
      <p className="font-[family-name:var(--font-spacemono)] text-xs text-stone">
        Free. Unsubscribe whenever. The Editor hates spam more than you do.
      </p>
    </form>
  );
}
