---
name: terry-design-system
description: Visual language and component library for Terry Terry Larry Berry. Use to build pages, marketing, social content that maintains brand consistency across all four character perspectives.
version: 1.0
---

# Terry Design System Skill

## Core Philosophy

The brand exists in four distinct voices that must blend, never reduce:
- **Terry (Sketcher)**: Obsessive line work, iteration, incompleteness, nervous energy
- **Terry (Philosopher)**: Duality, observation, silence, asking questions
- **Larry (Documentarian)**: Street photography, moment capture, urgency, Vancouver specificity
- **Berry (Editor)**: Curation, restraint, saying no, "it's too much"

Never design for one voice alone. Always blend them.

## Color System

### Character Colors (Use Together, Not Separate)

**Terry Sketcher**
- Primary: #1A1A1A (deep black)
- Accent: #FFE135 (electric yellow)
- Secondary: #F5F5F5 (off-white)

**Terry Philosopher**
- Primary: #2C2C2C (charcoal)
- Accent: #808080 (gray)
- Secondary: #FFFFFF (white)

**Larry Documentarian**
- Primary: #0F0F0F (true black)
- Accent: #CC0000 (documentary red)
- Secondary: #E8E8E8 (newsprint gray)

**Berry Editor**
- Primary: #3D3D3D (medium dark)
- Accent: #2D5F2E (muted forest green)
- Secondary: #FAFAFA (barely off-white)

### Blended Color Hierarchy

1. Black + Yellow + Red (visual shouting match)
2. Gray as mediator
3. Greens as accent restraint
4. Whites as breathing room

Example: Dark background (1A1A1A), yellow heading (FFE135), red accent stripe (CC0000), green subtle border (2D5F2E), white space dominant.

## Typography Stack

### Display (Headers)

**Bebas Neue** (all caps, letter-spacing 0.15em)
- Used for: Section titles, character names, sticker pack titles
- Weight: Bold
- Size: 32px–64px
- Mood: Raw, energetic, street-art influence

**IBM Plex Mono** (for philosophy, quotes)
- Used for: Character voice quotes, philosophical statements
- Weight: Regular or Bold
- Size: 14px–18px
- Mood: Honest, technical, documented

### Body Text

**Crimson Text** (serif, warm, readable)
- Used for: Bio text, story descriptions, character narratives
- Weight: Regular (400) for body, Bold (700) for emphasis
- Size: 16px–18px desktop, 14px–16px mobile
- Line-height: 1.7

**Space Mono** (monospace, for details)
- Used for: Product specs, URLs, technical info
- Weight: Regular
- Size: 12px–14px
- Mood: Direct, unambiguous

### Font Pairing Rules

- Never mix serif + monospace in same section
- Bebas headers always stand alone (white space above/below)
- Crimson body with IBM Plex callouts works best
- Monospace only for metadata or code

## Spacing & Grid

### Base Unit: 8px

All spacing in multiples of 8:
- 8px: tight spacing, element-to-element
- 16px: standard padding, breathing room
- 24px: section separation
- 32px: major section breaks
- 48px: full layout breathing room
- 64px: hero whitespace

### Layout Grid

- Desktop: 12-column grid, max-width 1440px
- Tablet: 8-column grid, max-width 1024px
- Mobile: 4-column grid, full width with 16px gutters

### Component Spacing

- Card padding: 24px internal
- Border-radius: 0px (sharp corners, raw aesthetic)
- Box-shadow: 0 8px 24px rgba(0,0,0,0.15)
- Margin between cards: 24px

## Components

### Button (Primary CTA)

Background: #1A1A1A
Color: #FFE135
Border: 2px solid #FFE135
Padding: 12px 32px
Font: Bebas Neue, 16px, bold
Letter-spacing: 0.1em
Hover: Background becomes #FFE135, color becomes #1A1A1A
Transition: 0.2s ease

### Card (Product/Story)

Background: #FFFFFF
Border-left: 4px solid [character-color]
Padding: 24px
Box-shadow: 0 8px 24px rgba(0,0,0,0.1)
Border-radius: 0

### Quote Block (Character Voice)

Border-left: 8px solid [character-color]
Padding-left: 24px
Font: IBM Plex Mono, 14px, bold
Color: #1A1A1A
Margin: 32px 0

### Divider (Section Break)

Height: 2px
Background: linear-gradient(90deg, #1A1A1A 0%, #FFE135 50%, #CC0000 100%)
Margin: 48px 0

## Animation & Interaction

### Micro-interactions

**Hover (Links)**
- Underline appears (2px solid, character color)
- Slight color shift (not fade, shift)
- Transition: 0.2s max

**Button Click**
- 0.1s press animation (scale 0.98)
- No ripple effect

**Scroll Reveal**
- Fade-in + slide-up
- Timing: 0.6s, ease-out-cubic
- Desktop only

### Animation Principles

- Speed: 0.2s–0.4s for micro, 0.6s–1s for reveals
- Easing: ease-out-cubic
- Restraint: One animated element per section max
- Meaning: Only animate if it clarifies

## Image Treatment

### Photography (Larry's Domain)

- Black and white or high-contrast color
- Shot at angles, rarely centered
- Optional grain texture (0.5–1%)
- Border: None or 2px black
- Caption: Crimson Text, italic

### Illustration (Terry Sketcher's Domain)

- Hand-drawn line work
- Pencil or ink texture
- Layered and imperfect
- Can be colorful (yellows, reds) or monochrome

### Design Elements (Berry's Domain)

- Minimal geometric shapes
- Restraint with color
- Functional, not decorative
- Supports text, doesn't compete

## Layout Patterns

### Hero Section

[Full-width image/illustration]
[Overlaid text: white or black]
- Title: Bebas Neue, 48px+, all caps
- Subtitle: Crimson Text, 20px
[CTA button below]

### Two-Column (Character vs. Shop)

[Left: Character image + bio — 60% width]
[Right: Product grid — 40% width]
Gap: 32px

### Full-Width Story

[Centered text container, max-width 800px]
- Title: Bebas Neue
- Body: Crimson Text, 18px, line-height 1.8
- Accent quote: IBM Plex Mono in red

### Product Grid

3 columns on desktop
2 columns on tablet
1 column on mobile
Gap: 24px
Card height: auto (content-driven)

## Dark Mode

Background: #0F0F0F
Text: #F5F5F5
Accents: Brighter (yellow more luminous, red more vivid)

Use media query:
```css
@media (prefers-color-scheme: dark) {
  /* dark mode rules */
}
```

## Accessibility

- Contrast: WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- Focus states: Bright yellow outline (2px) on all interactive
- Alt text: Descriptive for all images
- Font sizing: Minimum 16px mobile, 14px desktop
- Line height: Never less than 1.5

## When to Break the Rules

**CAN break if:**
- It serves the brand story
- It's intentional and documented
- It maintains hierarchy and readability

**CANNOT break if:**
- It makes text hard to read
- It adds decorative elements without purpose
- It weakens the connection to the four characters

## Usage Checklist

Building a new page:
1. Choose primary character voice (or blend them)
2. Select color palette from that character
3. Use typography hierarchy: Bebas headers, Crimson body
4. Apply 8px grid to all spacing
5. Add one dividing element (gradient line, photo, quote block)
6. Test contrast and readability
7. Animate only if it clarifies

## Tools & Fonts

- Bebas Neue (Google Fonts)
- Crimson Text (Google Fonts)
- IBM Plex Mono (Google Fonts)
- Space Mono (Google Fonts)
- Icons: Feather Icons or hand-drawn to match Terry's sketch style
