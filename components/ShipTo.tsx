"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { COUNTRIES, REGIONS, parseDestination, type CountryCode, type Destination } from "@/lib/regions";

/**
 * Where the buyer is shipping to, remembered across every product card on the
 * page (and the next visit) so they only type it once. Shipping is priced from
 * this: see lib/shipping.ts.
 */
const KEY = "tt_ship_to";
const listeners = new Set<() => void>();
let memory = "";

function read(): string {
  if (memory) return memory;
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function save(destination: Destination) {
  memory = JSON.stringify(destination);
  try {
    window.localStorage.setItem(KEY, memory);
  } catch {
    // Private mode / blocked storage: the in-memory copy still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useDestination(): Destination | null {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => {
    if (!raw) return null;
    try {
      const parsed = parseDestination(JSON.parse(raw));
      return parsed.ok ? parsed.destination : null;
    } catch {
      return null;
    }
  }, [raw]);
}

export function ShipToField({ destination }: { destination: Destination | null }) {
  const [editing, setEditing] = useState(false);
  const [country, setCountry] = useState<CountryCode>(destination?.country ?? "CA");
  const [state, setState] = useState(destination?.state ?? "");
  const [postalCode, setPostalCode] = useState(destination?.postalCode ?? "");
  const [error, setError] = useState<string | null>(null);

  const meta = COUNTRIES.find((c) => c.code === country)!;

  if (destination && !editing) {
    return (
      <p className="shop-shipto shop-shipto--set">
        <span>Ship to {destination.state} {destination.postalCode}</span>
        <button type="button" onClick={() => { setCountry(destination.country); setState(destination.state); setPostalCode(destination.postalCode); setEditing(true); }}>
          Change
        </button>
      </p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseDestination({ country, state, postalCode });
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    save(parsed.destination);
    setEditing(false);
  }

  return (
    <form className="shop-shipto" onSubmit={submit} noValidate>
      <p className="shop-shipto__legend">Where is it going?</p>
      <div className="shop-shipto__row">
        <label>
          <span>Country</span>
          <select value={country} onChange={(e) => { setCountry(e.target.value as CountryCode); setState(""); }}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label>
          <span>{meta.regionLabel}</span>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Select</option>
            {REGIONS[country].map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>{meta.postalLabel}</span>
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            autoComplete="postal-code"
            inputMode={country === "US" ? "numeric" : "text"}
            placeholder={country === "CA" ? "V5N 4B6" : "10001"}
          />
        </label>
      </div>
      {error && <p className="shop-shipto__error" role="alert">{error}</p>}
      <button type="submit">Get shipping</button>
    </form>
  );
}
