# Footer graphic directions (archived)

Explorations for the Terry face graphic in the store footers and error pages,
October 2026. The chosen direction, **D · Symbols** (Type set, Micro 6px
cells, constant glyph switching), shipped on `main` as
`components/TerrySymbols.tsx`. Everything else lives here so nothing is lost.

| File | What it is |
| --- | --- |
| `terry-engraving-lab.html` | The full interactive lab, self-contained (open it in a browser). Every direction, colourway, symbol set and type size is switchable. |
| `terry-engraving-lab.template.html` | The lab's source before the face images are inlined (`__FACE__` = 256px PNG, `__MASK__` = 1024px PNG, both base64). |
| `prototypes/a-wet-ink.html` | **A · Wet ink**: the engraving on a stable-fluids simulation; swipes smear the lines, a red second plate slips out of register. |
| `prototypes/b-loose-thread.html` | **B · Loose thread**: ~65k GPU-simulated stitches that sew the face; the pointer tears them loose. |
| `prototypes/c-relief.html` | **C · Relief**: the engraving rows as a 3D landscape of the face, tilting with the pointer. |
| `prototypes/common.js` | Shared WebGL2 helpers for the prototypes (serve this folder with any static server; ES modules need http). |
| `TerryEngraving.canvas.tsx` | The 2D-canvas "engraving" that was on `main` before Symbols replaced it (linefield contour-grid with the face as line weight). |
| `assets/face-hi-1024.png`, `face-hi-256.png` | Clean masks cut from the large Terry face drawing. |
| `assets/terry-face-mark-144.png` | The old 144px favicon-sized face the first versions used. |

Unused D variants (still switchable in the lab): the **Terry** set (`x o ~`),
the **Receipt** set (`$ % =`), and the 8 / 10 / 14px type sizes. A loupe
(magnifier) variant was tried and dropped; it is in the lab's history only.
