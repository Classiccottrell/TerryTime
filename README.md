# Terry Terry Larry Berry

An East Van underground art collective masquerading as a sticker brand. This repository contains the complete brand system, frontend landing page, backend scaffolding, and AI-ingestible skill definitions for the project.

## 📂 Repository Structure

```text
TerryTime/
├── .agents/
│   └── skills/           # AI & Developer Brand Documentation (Source of truth)
│       ├── SKILL-TERRY-DESIGN-SYSTEM.md
│       ├── SKILL-TERRY-CHARACTER-VOICES.md
│       ├── SKILL-TERRY-COMMUNITY-ORCHESTRATION.md
│       └── CHARACTER-PROFILES.md
├── client/               # The Frontend Landing Page
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       └── checkout.js
└── server/               # Backend API for Checkout & Fulfillment
    ├── server.js
    ├── package.json
    └── .env.example
```

---

## 🛠 How to Use What Has Been Built

### 1. The Frontend (The Website)
The site is built with pure, lightning-fast HTML, CSS, and JS. 
- **To view it:** Simply open `client/index.html` in your web browser. 
- **To run a local dev server:** If you use VS Code, use the "Live Server" extension, or run `npx serve client` from the root directory to view the site on `localhost`.

### 2. The Backend (Stripe & Fulfillment)
The backend `server/server.js` exists to handle automated purchases.
- **Setup:** 
  1. Open your terminal and navigate to `cd server`.
  2. Run `npm install` to download dependencies.
  3. Rename `.env.example` to `.env` and fill in your actual Stripe API keys.
- **Run:** `node server.js` will start the API on port 4242. 

### 3. The Details (The Skills)
The folder `.agents/skills/` contains the "DNA" of your project. If you bring this repository to an AI context (like Claude or another instance of an AI assistant), it can ingest these markdown files to automatically know exactly how to talk, design, and code for Terry, Terry, Larry, and Berry.

---

## 🚀 How to Expand and Edit the System

### Editing the Content and Adding Art
1. Add your custom images/animations to a new `client/img/` folder.
2. Edit `client/index.html` to update the placeholder text ("Sticker Preview") with actual `<img src="img/your-file.png">` or `<video>` tags. 
3. Edit the `js/main.js` file to replace the mocked SVG string in the "Download Free SVG" function with actual downloadable files placed in a `/client/downloads/` folder.

### Expanding the Design System
1. Open `.agents/skills/SKILL-TERRY-DESIGN-SYSTEM.md` and define your new rule or color. **Always update the documentation first.**
2. Then, open `client/css/style.css` and add the matching CSS variables or classes. The CSS relies heavily on variables (e.g. `--sketcher-yellow`). To change Terry's yellow globally, just change it in the `:root` pseudo-class.

### Instructing AI to Expand the Site
Because you have `.agents/skills/`, expanding the site using an LLM is easy. You can prompt an AI like this:
> *"Read `.agents/skills/SKILL-TERRY-DESIGN-SYSTEM.md` and `SKILL-TERRY-CHARACTER-VOICES.md`. Build a new HTML page called `client/about.html` that uses the 'philosopher-card' style to display an essay written entirely in the tone of Terry the Philosopher."*
