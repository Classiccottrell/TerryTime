# Terry Terry Larry Berry

An East Van underground art collective masquerading as a sticker brand. This repository contains the complete brand system, frontend landing page, backend scaffolding, and AI-ingestible skill definitions.

## ⚠️ Important Note on System Requirements

**You do NOT currently have Node.js or NPM installed on your Mac.** 
This is why your previous attempts to run commands like `npm install`, `node server.js`, or `npx serve` were failing.

To test the site immediately, use the Python test instructions below. If you want to deploy the automated Stripe storefront, you **must download and install Node.js** (from [nodejs.org](https://nodejs.org)) beforehand.

---

## 🛠 How to Test Locally RIGHT NOW

Because your Mac already has Python 3 installed, you can launch a local web server to test the site immediately. 

1. Open your terminal.
2. Navigate to the `client` folder inside this repository:
   ```bash
   cd /Users/mattcottrell/Documents/GitHub/TerryTime
   ```
3. Run the following command:
   ```bash
   python3 -m http.server 8000 --directory client
   ```
4. Open your web browser and go to: **[http://localhost:8000](http://localhost:8000)**

---

## 🚀 Deployment & The Backend (Requires Node.js)

I have unified the project structure. Once deployed, the server will automatically serve your frontend website *and* handle your Stripe automated shop payments on the same URL!

### 1. Install Node.js
Go to [nodejs.org](https://nodejs.org) and download/install the LTS version for macOS.

### 2. Configure Your Keys
Rename the `.env.example` file in the root folder to `.env` and paste your actual Stripe and (eventually) Printful API keys inside it.

### 3. Run the Full App
Open your terminal to the `TerryTime` root folder and run:
```bash
npm install     # Installs all necessary backend dependencies
npm start       # Starts the combined frontend/backend server
```
The site will be live at `http://localhost:4242` with Stripe checkout hooks fully active!

---

## 📂 Repository Structure

```text
TerryTime/
├── .agents/
│   └── skills/           # AI Brand Documentation (Your Source of Truth)
│       ├── SKILL-TERRY-DESIGN-SYSTEM.md
│       ├── SKILL-TERRY-CHARACTER-VOICES.md
│       ├── SKILL-TERRY-COMMUNITY-ORCHESTRATION.md
│       └── CHARACTER-PROFILES.md
├── client/               # The Frontend Landing Page (HTML/CSS/JS)
├── server/               # The Backend Node API
├── package.json          # Dependency list for deployment
└── .env.example          # Template for your Secret API keys
```

## 🧠 Using AI to Expand the Site

Because you have the `.agents/skills/` folder, expanding the site using an LLM is a breeze. When using Claude or Gemini, you can prompt like this:

> *"Read the markdown files in `.agents/skills/`. Build a new HTML page called `client/about.html` that uses the 'philosopher-card' aesthetic to display an essay written entirely in the tone of Terry the Philosopher."*

The AI will output perfectly matching HTML, `#2C2C2C` colors, and the correct voice automatically.
