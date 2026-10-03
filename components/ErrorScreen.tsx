import type { ReactNode } from "react";
import { TerrySymbols } from "@/components/TerrySymbols";

/**
 * One template for every error state (404, runtime error, root-layout failure):
 * the code and a short line on paper, the Terry engraving filling the right side.
 */
export function ErrorScreen({
  code,
  title,
  message,
  children,
}: {
  code: string;
  title: ReactNode;
  message: ReactNode;
  /** Action links / buttons. */
  children: ReactNode;
}) {
  return (
    <section className="error-screen" aria-labelledby="error-title">
      <TerrySymbols faceX={0.7} faceY={0.5} faceScale={0.84} narrow={{ faceX: 0.5, faceY: 0.25, faceScale: 0.9 }} />
      <div className="error-screen__copy">
        <p className="shop-kicker">Error {code}</p>
        <p className="error-screen__code" aria-hidden="true">{code}</p>
        <h1 id="error-title">{title}</h1>
        <p className="error-screen__message">{message}</p>
        <div className="error-screen__actions">{children}</div>
      </div>
    </section>
  );
}
