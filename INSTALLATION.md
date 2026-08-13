# 🛠️ TS-HACK // Installation & Setup Guide

This guide provides step-by-step instructions for installing and running **TS-HACK** on Linux, Windows, or macOS, including optional setups for local Ollama AI models and Kokoro Docker text-to-speech voice synthesis.

---

## 📋 System Requirements

* **Operating System:** Linux, Windows (WSL2 / PowerShell), or macOS
* **Python:** Python 3.8 or higher
* **Web Browser:** Chrome, Firefox, Edge, or Brave
* **Optional Hardware:** Works on low-end CPUs, dual-core systems, and Virtual Private Servers (VPS).

---

## ⚡ Step 1: Base Application Setup

1. **Open your terminal and navigate to your workspace:**
   ```bash
   cd /home/jack/Desktop/LEARN_TYPESCRIPT
   ```

2. **Verify Python 3 is installed:**
   ```bash
   python3 --version
   ```

3. **Launch the TS-HACK Python server:**
   ```bash
   python3 server.py 8080
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```text
   http://localhost:8080
   ```

> **Note:** On first startup, `server.py` will automatically create the SQLite3 database file (`notes.db`) and the hard drive audio cache folder (`audio_cache/`).

---

## 🤖 Step 2: Local Ollama AI Setup (Optional)

TS-HACK includes an in-app AI Assistant that connects to a local Ollama server for offline hint generation and TypeScript tutoring.

1. **Install Ollama:**
   * **Linux:** `curl -fsSL https://ollama.com/install.sh | sh`
   * **Windows/macOS:** Download installer from [ollama.com](https://ollama.com/)

2. **Pull your preferred AI model:**
   ```bash
   ollama pull codellama
   # or
   ollama pull llama3
   # or
   ollama pull deepseek-r1:8b
   ```

3. **Start the Ollama server:**
   ```bash
   ollama serve
   ```

4. **Connect in TS-HACK:**
   * Click the **`🤖 OLLAMA AI ASSISTANT`** tab in TS-HACK.
   * Verify the host URL is set to `http://localhost:11434` and click **`🔌 TEST CONNECTION`**.
   * Select your downloaded model from the dropdown list.

---

## 🎙️ Step 3: Kokoro Docker TTS Voice Synthesis (Optional)

TS-HACK supports high-quality neural voice synthesis via a local Kokoro Docker container.

1. **Verify Docker is installed:**
   ```bash
   docker --version
   ```

2. **Run the Kokoro Docker container:**
   ```bash
   docker run -d \
     --name kokoro-tts \
     -p 8880:8880 \
     --restart unless-stopped \
     jacknorthrup/kokoro:v1
   ```

3. **Verify container status:**
   ```bash
   docker ps
   ```
   * Ensure port `8880->8880/tcp` is listed as active.

4. **Voice Streaming & Caching in TS-HACK:**
   * TS-HACK proxies requests from `http://localhost:8080/api/kokoro/speech` to `http://localhost:8880/v1/audio/speech` with a **120-second CPU PyTorch timeout**.
   * All 60+ Kokoro voice profiles (`af_heart`, `af_bella`, `am_adam`, `bf_emma`, etc.) will load automatically in the top bar voice selector.
   * Generated MP3 files are automatically saved to disk (`audio_cache/*.mp3`) for instant `<1ms` future playback.

---

## 🔧 Step 4: Hosting on a VPS / Docker Container

Because TS-HACK has zero heavy dependencies, you can host it on any low-cost VPS ($4-$5/month):

```bash
# Run server in background or via systemd / tmux
nohup python3 server.py 8080 > server.log 2>&1 &
```

---

## ❓ Troubleshooting & FAQ

* **Issue: Server error on startup (`Address already in use`).**
  * **Fix:** Change the port number: `python3 server.py 8085` and navigate to `http://localhost:8085`.
* **Issue: Kokoro voice speech shows `⏳ GENERATING AUDIO...` for 20-30 seconds.**
  * **Explanation:** When running on CPU without a GPU, PyTorch neural inference takes ~25s for the first run. Once generated, the audio is saved to disk and will play **instantly (<1ms)** on all future plays!
* **Issue: Ollama shows `OFFLINE`.**
  * **Fix:** Ensure `ollama serve` is running and CORS headers allow connections from `http://localhost:8080`.
