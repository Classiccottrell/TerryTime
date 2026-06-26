const PHRASE =
  "IT'S TERRY TIME — ONE STICKER. INFINITE HUSTLE. — GET RICH QUICK — OR DON'T — WE DON'T CARE — #EASTVAN —";

export function Ticker() {
  return (
    <div className="bg-ink text-yellow overflow-hidden select-none border-b border-ink">
      <div className="flex whitespace-nowrap animate-ticker font-[family-name:var(--font-spacemono)] text-xs font-bold tracking-[0.2em] py-2">
        <span className="px-4">{PHRASE.repeat(4)}</span>
        <span className="px-4" aria-hidden="true">
          {PHRASE.repeat(4)}
        </span>
      </div>
    </div>
  );
}
