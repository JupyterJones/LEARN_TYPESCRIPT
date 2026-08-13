/* TS-HACK // Kokoro Docker CPU Audio Proxy & Persistent IndexedDB Cache */

class KokoroTTS {
  constructor() {
    this.endpoint = '/api/kokoro/speech';
    this.voicesEndpoint = '/api/kokoro/voices';
    this.voice = 'af_heart';
    this.enabled = true;
    this.isSpeaking = false;
    this.audioElement = new Audio();
    this.kokoroServerOnline = false;
    this.db = null;

    this.initCacheDB();
    this.initDockerConnection();
  }

  // Initialize IndexedDB Persistent Audio Store
  initCacheDB() {
    try {
      const request = indexedDB.open('KokoroAudioCacheDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audio_cache')) {
          db.createObjectStore('audio_cache', { keyPath: 'cacheKey' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log('[KOKORO CACHE]: IndexedDB persistent audio store ready.');
      };
      request.onerror = (err) => {
        console.warn('[KOKORO CACHE]: IndexedDB open error:', err);
      };
    } catch (err) {
      console.warn('[KOKORO CACHE]: IndexedDB not available:', err);
    }
  }

  async getCachedAudio(cacheKey) {
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('audio_cache', 'readonly');
        const store = tx.objectStore('audio_cache');
        const req = store.get(cacheKey);
        req.onsuccess = () => resolve(req.result ? req.result.blob : null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async saveAudioToCache(cacheKey, blob) {
    if (!this.db) return;
    try {
      const tx = this.db.transaction('audio_cache', 'readwrite');
      const store = tx.objectStore('audio_cache');
      store.put({ cacheKey, blob, createdAt: Date.now() });
      console.log(`💾 [KOKORO CACHE SAVED]: Audio saved to IndexedDB cache ("${cacheKey.substring(0, 35)}...")`);
    } catch (err) {
      console.warn('[KOKORO CACHE SAVE ERROR]:', err);
    }
  }

  async initDockerConnection() {
    try {
      const res = await fetch(this.voicesEndpoint);
      if (res.ok) {
        const data = await res.json();
        const voices = data.voices || [];
        if (voices.length > 0) {
          this.kokoroServerOnline = true;
          console.log(`[KOKORO DOCKER]: Connected to local Kokoro container. Loaded ${voices.length} voices.`);
          
          const select = document.getElementById('kokoro-voice-select');
          if (select) {
            select.innerHTML = voices.map(v => 
              `<option value="${v}" ${v === this.voice ? 'selected' : ''}>Kokoro: ${v}</option>`
            ).join('');
          }
          this.updateHeaderBadge(true, voices.length);
        } else {
          this.updateHeaderBadge(false);
        }
      } else {
        this.updateHeaderBadge(false);
      }
    } catch (err) {
      console.warn('[KOKORO]: Docker container proxy unavailable:', err);
      this.kokoroServerOnline = false;
      this.updateHeaderBadge(false);
    }
  }

  updateHeaderBadge(isOnline, count = 0) {
    const icon = document.getElementById('tts-icon');
    if (icon) {
      icon.title = isOnline ? `Kokoro Docker: ONLINE (${count} voices loaded)` : 'Kokoro Docker: Offline (Using Browser WebSpeech)';
    }
  }

  setVoice(voiceId) {
    this.voice = voiceId;
  }

  async speak(text) {
    if (!this.enabled || !text) return;

    // Stop previous audio
    this.stop();

    // Clean text (remove markdown formatting & code blocks)
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~]/g, '')
      .replace(/🌐/g, '')
      .replace(/⚡/g, '')
      .trim();

    if (!cleanText) return;

    // If Kokoro Docker container is online, stream MP3 audio directly or load from cache
    if (this.kokoroServerOnline) {
      const success = await this.speakKokoroAPI(cleanText);
      if (success) return;
    }

    // Fallback to WebSpeech if container proxy is unreachable
    this.speakBrowserFallback(cleanText);
  }

  async speakKokoroAPI(text) {
    const btn = document.getElementById('btn-read-briefing-tts');
    const cacheKey = `${this.voice}:${text}`;

    // 1. Check IndexedDB Persistent Audio Cache FIRST
    const cachedBlob = await this.getCachedAudio(cacheKey);
    if (cachedBlob) {
      console.log(`⚡ [KOKORO CACHE HIT]: Playing instant cached audio for voice "${this.voice}"!`);
      if (btn) btn.textContent = '🔊 PLAYING INSTANT CACHED AUDIO...';
      this.playAudioBlob(cachedBlob, btn);
      return true;
    }

    // 2. Cache miss -> Generate via Kokoro Docker container on CPU
    if (btn) btn.textContent = '⏳ KOKORO CPU GENERATING AUDIO...';

    try {
      console.log(`[KOKORO DOCKER]: Requesting speech audio stream for voice "${this.voice}" on CPU...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout for CPU PyTorch inference

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'kokoro',
          input: text,
          voice: this.voice,
          response_format: 'mp3',
          speed: 1.0
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const blob = await response.blob();

        // Save generated audio to persistent IndexedDB cache for future instant playback
        await this.saveAudioToCache(cacheKey, blob);

        if (btn) btn.textContent = '🔊 PLAYING AUDIO...';
        this.playAudioBlob(blob, btn);
        return true;
      }
    } catch (err) {
      console.error('[KOKORO DOCKER Fetch Error]:', err);
      if (btn) btn.textContent = '🔊 SPEAK BRIEFING ALOUD';
    }
    return false;
  }

  playAudioBlob(blob, btn = null) {
    const url = URL.createObjectURL(blob);
    this.audioElement.src = url;

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isSpeaking = true;
      }).catch(err => {
        console.error('[KOKORO Autoplay Error]:', err);
      });
    }

    this.audioElement.onended = () => {
      this.isSpeaking = false;
      if (btn) btn.textContent = '🔊 SPEAK BRIEFING ALOUD';
    };
  }

  speakBrowserFallback(text) {
    if (!('speechSynthesis' in window)) return;

    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      const synthVoices = window.speechSynthesis.getVoices();
      if (synthVoices && synthVoices.length > 0) {
        const pref = synthVoices.find(v => 
          v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
        ) || synthVoices.find(v => v.lang.startsWith('en'));
        if (pref) utterance.voice = pref;
      }

      utterance.onstart = () => { this.isSpeaking = true; };
      utterance.onend = () => { this.isSpeaking = false; };
      utterance.onerror = () => { this.isSpeaking = false; };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[KOKORO Fallback Exception]:', err);
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}

window.kokoroTTS = new KokoroTTS();
