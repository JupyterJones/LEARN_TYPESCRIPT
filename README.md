# ⚡ TS-HACK // Cyberpunk TypeScript Simulator & Learning Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green?style=flat-square&logo=python)](https://www.python.org/)
[![SQLite3](https://img.shields.io/badge/SQLite3-Embedded-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-black?style=flat-square)](https://ollama.com/)
[![Kokoro TTS](https://img.shields.io/badge/Kokoro-Docker%20TTS-FF6F00?style=flat-square&logo=docker)](https://hub.docker.com/r/jacknorthrup/kokoro)

**TS-HACK** is a retro-futuristic, single-page cyberpunk hacking terminal simulator built to master **strict TypeScript** and **backend data architecture**. 

Breach legacy JavaScript mainframes across fictional corporate targets (*Daylan Electric Maylar*, *Marchel Water Works*, *Marketal Utilities*, and *Manila Philippines Telecom*), refactor un-typed code into strict TypeScript, query local SQLite3 databases, and chat with offline Ollama AI models.

---

```
### 📂 Saved Camera Feeds in :

  • ⚡ Node 01: camera_feed.jpg
  (CAM 01 // Daylan Electric Maylar Power Sub-station Vault — Dayton, OH)
  • 💧 Node 02: cam_node_2_1786587748058.jpg
  (CAM 02 // Marchel Water Works Filtration Chamber — Dayton, OH)
  • 📡 Node 03: camera_feed_water.jpg
  (CAM 03 // Marketal Utilities Telemetry Router Vault)
  • 🗄️ Node 04: cam_node_4_1786587797380.jpg
  (CAM 04 // SQLite3 Underground Tape Backup Vault)
  • 📄 Node 05: camera_feed_exterior.jpg
  (CAM 05 // Secure JSON Data Archives & Perimeter Compound)
  • 🌊 Node 06: camera_feed_water.jpg
  (CAM 06 // Colorado Underground Water Reservoir Vault)
  • 🛰️ Node 07: cam_node_7_1786587822390.jpg
  (CAM 07 // Satellite Communications Uplink Control Room)
  • 🌐 Node 08: camera_feed_telecom.jpg
  (CAM 08 // High-Speed Fiber Network Switching Hub)
  • 🇵🇭 Node 09: camera_feed_telecom.jpg
  (CAM 09 // Manila Philippines Subsea Fiber Optic Terminal)

```

## ✨ Features Overview

* 💻 **CodeMirror 5 IDE Engine:** Production-grade code editor with zero cursor drift, line numbering, syntax highlighting, and tab indents.
* 🛡️ **3-Tier Progressive Curriculum:**
  * **Level 1 (Core Fundamentals):** Primitives, explicit type annotations, interfaces, optional modifiers (`?`), `readonly`, and generics `<T>`.
  * **Level 2 (Database & Data Vaults):** SQLite3 database row mappers (`notes.db`), JSON schema validation, and strict `null` vs `undefined` handling.
  * **Level 3 (Async REST APIs & Network Intercepts):** Asynchronous `Promise<T>`, discriminated union results (`SuccessResult<T>` | `ErrorResult`), and utility types (`Pick`, `Omit`, `Partial`).
* 👤 **Multi-Player Profile Isolation System:** Create, switch, or delete player aliases (`jack1`, `jack2`, `sarah_hacker`) to test yourself on clean runs without altering master records.
* 🧪 **TypeScript Sandbox Playground:** Relaxed, timer-free code editor with 5 preset templates and live AST type checking diagnostics.
* 📖 **The Cyber Codex:** Interactive TypeScript reference manual with one-click *"Copy to Sandbox"* code examples.
* 📹 **Multi-Sector Security Surveillance Feeds:** 4 live intercepted CCTV camera feeds with real-time HUD telemetry, breach status overlays, and green phosphor night vision.
* 🎙️ **Kokoro Docker TTS Voice Synthesis:** Stream neural speech audio directly from a local Kokoro Docker container (`jacknorthrup/kokoro:v1` on port `8880`) with **IndexedDB + Hard Drive MP3 Caching** for instant `<1ms` playback.
* 🗄️ **SQLite3 Hacker Notepad:** Integrated REST Notepad saving notes directly to `/notes.db` with TypeScript interface generator.
* 🤖 **Ollama Local AI Integration:** Connects to `http://localhost:11434` for model discovery (`llama3`, `codellama`, `deepseek-r1`) and offline TypeScript tutoring.
* 🏆 **Master Certification System:** Grants a printable Gold Certificate of Mastery when all 9 mainframes are 100% breached.

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/LEARN_TYPESCRIPT.git
   cd LEARN_TYPESCRIPT
   ```

2. **Start the local Python server:**
   ```bash
   python3 server.py 8080
   ```

3. **Open TS-HACK in your browser:**
   ```text
   http://localhost:8080
   ```

---

## 📁 Repository Structure

```text
LEARN_TYPESCRIPT/
├── index.html              # Single-Page CyberDeck Application Shell
├── styles.css              # Cyberpunk CSS Design System & Theme Rules
├── server.py               # Python Server, SQLite3 REST API & Kokoro Proxy
├── notes.db                # SQLite3 Database (auto-created on startup)
├── audio_cache/            # Permanent Hard Drive MP3 Audio Cache
├── assets/                 # High-res CCTV Camera Feed Images
│   ├── camera_feed.jpg
│   ├── camera_feed_water.jpg
│   ├── camera_feed_telecom.jpg
│   └── camera_feed_exterior.jpg
├── vendor/                 # CodeMirror 5 Vendor Dependencies
│   ├── codemirror.min.js
│   ├── codemirror.min.css
│   └── javascript.min.js
└── js/                     # Modular JavaScript Engines
    ├── app.js              # Application Orchestrator & State Manager
    ├── challenges.js       # 3-Tier Curriculum & Challenge Data
    ├── editor.js           # CodeMirror 5 Dual-Instance Engine
    ├── kokoro.js           # Kokoro TTS Proxy & IndexedDB Cache
    ├── notes.js            # SQLite3 Notes REST API Client
    ├── ollama.js           # Local Ollama AI Client
    ├── storage.js          # Multi-Player Profile Storage Engine
    ├── terminal.js         # Interactive CLI Terminal Engine
    └── tsValidator.js      # In-Browser AST Syntax & Rule Validator
```

---

## 📜 Documentation

* 📖 **[INSTALLATION.md](INSTALLATION.md):** Complete installation, Docker setup, and Ollama configuration guide.
* 🕹️ **[INSTRUCTIONS.md](INSTRUCTIONS.md):** Player user guide, terminal commands, and gameplay walkthrough.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
