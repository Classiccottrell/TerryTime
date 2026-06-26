const PHRASE =
  "IT'S TERRY TIME — ONE STICKER. INFINITE HUSTLE. — GET RICH QUICK — OR DON'T — WE DON'T CARE — #EASTVAN —";

export function Ticker() {
  return (
    <div className="bg-yellow text-ink overflow-hidden border-b-2 border-ink select-none">
      <div className="flex whitespace-nowrap animate-ticker font-[family-name:var(--font-spacemono)] text-xs font-bold tracking-widest py-1.5">
        <span className="px-4">{PHRASE.repeat(4)}</span>
        <span className="px-4" aria-hidden="true">
          {PHRASE.repeat(4)}
        </span>
      </div>
    </div>
  );
}
