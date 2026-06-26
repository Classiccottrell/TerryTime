export type Character = {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  voice: string[];
  quotes: string[];
  themes: string[];
  primary: string;
  accent: string;
  secondary: string;
  font: "display" | "mono" | "serif";
};

export const characters: Character[] = [
  {
    slug: "terry-the-sketcher",
    name: "Terry",
    role: "The Sketcher",
    tagline: "Lines don't finish. They just stop.",
    bio: "Obsessive, prolific, lines-everywhere energy. Always drawing. Never finishes. He looks at the void and sees the light. Deeply insecure but constantly searching for truth through line art.",
    voice: [
      "Urgent but not panicked",
      "Self-aware about perfectionism",
      "Talks about process, not product",
      "Repetitive — echoes ideas to drive them home",
    ],
    quotes: [
      "You're drawing what you think it looks like. Draw what it actually is.",
      "Again. Wrong angle. Again.",
      "Lines don't finish. They just stop.",
      "Sketch, iterate, sketch. That's the only truth.",
    ],
    themes: ["Process over product", "Iteration", "Imperfection as honesty", "Drawing as thinking"],
    primary: "#1a1a1a",
    accent: "#ffe135",
    secondary: "#f5f5f5",
    font: "display",
  },
  {
    slug: "terry-the-philosopher",
    name: "Terry",
    role: "The Philosopher",
    tagline: "Terry is always 2. See it twice.",
    bio: "Quiet, observational. Sees things twice — from a different angle. The shadow self of the first Terry, capable of depravity but generally stoic and removed. Asks questions instead of answering.",
    voice: [
      "Contemplative, not rushed",
      "Asks more than declares",
      "Paradoxical — holds two truths at once",
      "Poetic without being flowery",
    ],
    quotes: [
      "See it twice. The way it is and the way you imagined it.",
      "The corner exists in two states. Both are real.",
      "Observation is an act of decision.",
      "What you see depends on what you choose to look at.",
    ],
    themes: ["Duality & perspective", "Seeing vs. observing", "The observer's responsibility", "Art as a way of knowing"],
    primary: "#2c2c2c",
    accent: "#808080",
    secondary: "#ffffff",
    font: "mono",
  },
  {
    slug: "larry-the-documentarian",
    name: "Larry",
    role: "The Documentarian",
    tagline: "You're missing this right now.",
    bio: "Vancouver street photographer. Sharp eye. Captures moments. The middleman between Terry and Berry — the boss who always has get-rich-quick schemes, but takes the blows from both sides. A man of great ability and perception.",
    voice: [
      "Direct and immediate",
      "Street-smart, vernacular",
      "No pretense",
      "Vancouver-specific references",
    ],
    quotes: [
      "Moments, not poses.",
      "This is the real Vancouver. Not the postcard.",
      "Shoot first. Trust the frame.",
      "What's in. What's out. That's the whole job.",
    ],
    themes: ["Moments vs. poses", "Vancouver as a real place", "Capturing truth", "Urgency & presence"],
    primary: "#0f0f0f",
    accent: "#cc0000",
    secondary: "#e8e8e8",
    font: "mono",
  },
  {
    slug: "berry-the-editor",
    name: "Berry",
    role: "The Editor",
    tagline: "It's too much. Cut it.",
    bio: "Thinks it's all too much. The skeptic. The filter. The one who says no. In the brand narrative, she acts as the ultimate brutal curator — pruning the chaos so the message stays clear.",
    voice: [
      "Brutal honesty",
      "Short, critical",
      "Highly curated",
      "Less is more",
    ],
    quotes: [
      "No.",
      "Cut it. Cut half of it. Now cut more.",
      "If it doesn't earn the space, it's gone.",
      "Restraint is the loudest thing in the room.",
    ],
    themes: ["Less is more", "Cutting through the noise", "Curating the best", "Editorial restraint"],
    primary: "#3d3d3d",
    accent: "#2d5f2e",
    secondary: "#fafafa",
    font: "display",
  },
];

export function getCharacter(slug: string) {
  return characters.find((c) => c.slug === slug);
}
