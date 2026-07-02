/*
  Talisman icon set — hand-drawn brand marks.
  The star · eye · key come straight off the source painting; the rest are
  per-voice motifs. All stroke `currentColor`, so colour them with text-*.
*/

type IconProps = { className?: string; size?: number };

function Svg({
  children,
  className,
  size = 48,
  label,
}: IconProps & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const icons = {
  eye: "All-seeing eye — observation",
  star: "Star — the underground mark",
  key: "Key — the way in",
  duality: "Duality — see it twice",
  scissors: "Scissors — the edit",
  pencil: "Pencil — the unfinished line",
  frame: "Viewfinder — the captured moment",
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, ...rest }: { name: IconName } & IconProps) {
  switch (name) {
    case "eye":
      return (
        <Svg {...rest} label={icons.eye}>
          <path d="M12 50 Q50 20 88 50 Q50 80 12 50 Z" />
          <circle cx="50" cy="50" r="11" />
          <circle cx="50" cy="50" r="2.5" fill="currentColor" />
          <path d="M50 14 v-8 M50 94 v-8 M18 24 l-6 -6 M82 24 l6 -6 M18 76 l-6 6 M82 76 l6 6" />
        </Svg>
      );
    case "star":
      return (
        <Svg {...rest} label={icons.star}>
          <path d="M50 12 L60 40 L90 42 L66 60 L74 88 L50 71 L26 88 L34 60 L10 42 L40 40 Z" />
        </Svg>
      );
    case "key":
      return (
        <Svg {...rest} label={icons.key}>
          <circle cx="50" cy="28" r="17" />
          <path d="M50 45 V86 M50 66 H68 M50 78 H64" />
        </Svg>
      );
    case "duality":
      return (
        <Svg {...rest} label={icons.duality}>
          <circle cx="38" cy="50" r="26" />
          <circle cx="62" cy="50" r="26" />
        </Svg>
      );
    case "scissors":
      return (
        <Svg {...rest} label={icons.scissors}>
          <circle cx="26" cy="70" r="12" />
          <circle cx="26" cy="30" r="12" />
          <path d="M36 62 L84 24 M36 38 L84 76" />
        </Svg>
      );
    case "pencil":
      return (
        <Svg {...rest} label={icons.pencil}>
          <path d="M20 80 L70 30 L82 42 L32 92 Z" transform="translate(-6 -8)" />
          <path d="M64 24 L76 36" transform="translate(-6 -8)" />
          <path d="M14 86 q6 -4 12 0" />
        </Svg>
      );
    case "frame":
      return (
        <Svg {...rest} label={icons.frame}>
          <path d="M18 30 H14 V26 M82 30 H86 V26 M18 70 H14 V74 M82 70 H86 V74" />
          <rect x="26" y="34" width="48" height="32" />
          <circle cx="50" cy="50" r="9" />
        </Svg>
      );
  }
}
