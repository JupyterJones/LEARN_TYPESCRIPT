# 🕹️ TS-HACK // Player User Guide & Gameplay Instructions

Welcome to **TS-HACK**, a cyberpunk terminal simulator designed to teach strict TypeScript and real-world backend data architecture through interactive hacking challenges.

---

## 🎮 How to Play

### 1. Navigating the CyberDeck Interface

The CyberDeck interface is divided into several specialized views:

* 💻 **IDE & CODE EDITOR:** Your primary workspace. Read mission briefings, refactor legacy JavaScript code, run type diagnostics, and breach mainframes.
* 🧪 **TS SANDBOX PLAYGROUND:** A timer-free, zero-pressure playground where you can write custom TypeScript code, test ideas, and try pre-made templates.
* 📖 **CYBER CODEX:** An interactive reference library explaining all major TypeScript features with copyable code examples.
* 📟 **CYBER TERMINAL:** An interactive CLI command line interface for scanning networks, switching camera feeds, checking models, and inspecting stats.
* 🤖 **OLLAMA AI ASSISTANT:** An offline AI tutor to explain type errors, ask questions, or request hints.
* 📹 **SECURITY CAM FEED:** Live intercepted CCTV camera feeds with green phosphor night vision and dynamic target status overlays.
* 📝 **SQLITE3 NOTEPAD:** A REST notepad backed by a real SQLite3 database (`notes.db`).
* 📁 **RECORD VAULT:** View your breached mainframe history, inspect saved code solutions, download JSON/Markdown reports, and view your Gold Master Certification Badge.

---

## 👤 Multi-Player Profile Isolation System

TS-HACK features a **Multi-Player Profile System** that lets you practice course runs repeatedly without losing your master record:

1. **Click `👤 PLAYER: JACK1`** in the top bar to open the Profile Manager.
2. **Create New Profiles:** Type a new alias (e.g. `jack2`, `daughter_run`, `sarah_hacker`) and click **`+ CREATE ALIAS`**.
3. **Switch Profiles:** Clicking any profile alias switches the application to that player's isolated progress, XP score, and saved solutions.
4. **Clean Slate Runs:** Playing as `jack2` resets the course to a clean slate, allowing you to test your memory from scratch. Your `jack1` master record remains 100% safe!

---

## 🛡️ The 3-Tier Hacking Curriculum

### 🛡️ Level 1: Mainframe Security Core (Fundamentals)
* **Node 01 — Daylan Electric Maylar (Dayton, OH):** Fix un-typed variables using primitive types (`number`, `string`, `boolean`, `number[]`).
* **Node 02 — Marchel Water Works (Dayton, OH & Colorado):** Define `WaterSensor` interfaces with `readonly` and optional `?` property modifiers.
* **Node 03 — Marketal Utilities:** Implement generic interfaces `TelemetryPacket<T>` and generic wrapper functions `wrapTelemetry<T>()`.

### 🗄️ Level 2: Database & Data Vault Hacking (Intermediate)
* **Node 04 — SQLite3 Database Mapper:** Create `SqliteNote` interfaces and write row mapping functions for `notes.db`.
* **Node 05 — JSON Schema Parser:** Implement predicate type guards (`obj is NoteConfig`) to safely validate untyped JSON data files.
* **Node 06 — SQL Null vs Undefined:** Sanitize database `NULL` vs `undefined` values using nullish coalescing `??` and type narrowing.

### 🌐 Level 3: Advanced Async APIs & Network Intercepts (Advanced)
* **Node 07 — Async REST Promises:** Handle asynchronous REST API operations using `Promise<ApiResponse<T>>`.
* **Node 08 — Discriminated Unions:** Create type-safe network result wrappers (`SuccessResult<T>` vs `ErrorResult`).
* **Node 09 — Manila Philippines Telecom Hub:** Refactor legacy data transformers using utility types (`Pick`, `Omit`, and `Partial`).

---

## 💻 Cyber Terminal Commands

Open the **`📟 CYBER TERMINAL`** tab or click the terminal button to run CLI commands:

```text
  help                  List all available cyber terminal commands
  scan                  Scan corporate network for mainframes and breach status
  hack <id>             Jump to mainframe node <1-9>
  ts-check              Compile and validate active IDE code solution
  cam <1-4>             Switch live security camera feeds (1: Power, 2: Water, 3: Manila Telecom, 4: Data Center Exterior)
  speak <text>          Synthesize speech text using Kokoro TTS
  ollama                Check Ollama local AI server status
  list-models           List downloaded local Ollama AI models
  select-model <name>   Set active Ollama AI model
  records               Display current profile progress and Cyber Credits
  export                Export session report as JSON file
  clear                 Clear terminal screen
```

---

## 🏆 Earning the Gold Master Certification Diploma

Inside the **`📁 RECORD VAULT`** tab, you will find the **TypeScript Master Certification System**:

* **Lock Rule:** The certificate starts **LOCKED** until **ALL 9 MAINFRAMES** across Level 1, Level 2, and Level 3 are 100% breached.
* **Unlocking:** Once Node 01 through Node 09 are breached, the lock disappears and reveals your official Gold Master Certificate.
* **Printing:** Click **`🖨️ PRINT / SAVE CERTIFICATE`** to print or save your diploma as a PDF!
