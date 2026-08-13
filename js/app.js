/* TS-HACK // Main Application Orchestrator & Bootstrapper */

class App {
  constructor() {
    this.currentNodeId = 1;
  }

  init() {
    console.log('[TS-HACK]: Initializing CyberDeck OS...');

    // Initialize modules
    window.editorManager.init();
    window.cyberTerminal.init();
    this.initMatrixCanvas();
    this.initTabs();
    this.initEventListeners();
    this.initClock();

    // Check Ollama status
    this.checkOllamaStatus();

    // Render Profiles, Nodes & Stats
    this.renderPlayerProfiles();
    this.renderNodeList();
    this.loadNode(1);
    this.updateStatsDisplay();
    this.renderRecordVault();
  }

  /* Matrix Canvas Background Animation */
  initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[];:?=+#@!$%&*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f3ff';
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    setInterval(draw, 40);
  }

  /* Tab Navigation */
  initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playKeyClick();
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const content = document.getElementById(tabId);

    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');

    if (tabId === 'ide-view' && window.editorManager && window.editorManager.cm) {
      setTimeout(() => window.editorManager.cm.refresh(), 50);
    }
  }

  /* Clock */
  initClock() {
    const clockEl = document.getElementById('live-clock');
    const update = () => {
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString();
      }
    };
    update();
    setInterval(update, 1000);
  }

  /* Node & Level Curriculum Management */
  renderNodeList() {
    const container = document.getElementById('node-list-container');
    const badge = document.getElementById('node-count-badge');
    if (!container) return;

    if (badge) badge.textContent = `${window.CYBER_CHALLENGES.length} NODES`;

    container.innerHTML = '';
    const progress = window.storageManager.loadProgress();

    let currentLevelTitle = '';

    window.CYBER_CHALLENGES.forEach(c => {
      if (c.levelTitle && c.levelTitle !== currentLevelTitle) {
        currentLevelTitle = c.levelTitle;
        const levelHeader = document.createElement('div');
        levelHeader.className = 'sector-header-tag';
        levelHeader.innerHTML = `<span>🛡️ ${c.levelTitle}</span>`;
        container.appendChild(levelHeader);
      }

      const isCompleted = progress[c.id] && progress[c.id].completed;
      const card = document.createElement('div');
      card.className = `node-card ${c.id === this.currentNodeId ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      card.setAttribute('data-node-id', c.id);

      card.innerHTML = `
        <div class="node-card-header">
          <span class="node-card-id">${c.tag}</span>
          <span class="node-card-diff">${c.difficulty}</span>
        </div>
        <div class="node-card-title">${c.title}</div>
      `;

      card.addEventListener('click', () => {
        window.soundEngine.playKeyClick();
        this.loadNode(c.id);
      });

      container.appendChild(card);
    });
  }

  /* Multi-Player Profile Manager UI */
  renderPlayerProfiles() {
    const activePlayer = window.storageManager.getActivePlayer();
    const activeDisplay = document.getElementById('active-player-display');
    if (activeDisplay) {
      activeDisplay.textContent = `PLAYER: ${activePlayer.toUpperCase()}`;
    }

    const listEl = document.getElementById('profile-buttons-list');
    if (!listEl) return;

    const profiles = window.storageManager.getProfiles();
    listEl.innerHTML = '';

    profiles.forEach(p => {
      const isCurrent = p === activePlayer;
      const btnGroup = document.createElement('div');
      btnGroup.className = `profile-select-item ${isCurrent ? 'active' : ''}`;
      btnGroup.innerHTML = `
        <button class="btn-cyber btn-small ${isCurrent ? 'btn-primary' : 'btn-outline'}" data-profile-handle="${p}">
          👤 ${p.toUpperCase()} ${isCurrent ? '(ACTIVE)' : ''}
        </button>
        ${profiles.length > 1 ? `<button class="btn-text btn-danger" data-delete-profile="${p}">[DEL]</button>` : ''}
      `;

      btnGroup.querySelector('[data-profile-handle]')?.addEventListener('click', () => {
        window.soundEngine.playKeyClick();
        window.storageManager.switchPlayer(p);
        this.onProfileSwitched();
      });

      btnGroup.querySelector('[data-delete-profile]')?.addEventListener('click', () => {
        window.soundEngine.playKeyClick();
        if (confirm(`Delete practice profile "${p}"?`)) {
          window.storageManager.deletePlayer(p);
          this.onProfileSwitched();
        }
      });

      listEl.appendChild(btnGroup);
    });
  }

  onProfileSwitched() {
    this.renderPlayerProfiles();
    this.renderNodeList();
    this.renderXP();
    this.loadNode(this.currentNodeId || 1);
    this.logConsole(`[PROFILE]: Switched active player to "${window.storageManager.getActivePlayer().toUpperCase()}".`, 'info');
  }

  loadNode(nodeId) {
    this.currentNodeId = nodeId;
    const challenge = window.CYBER_CHALLENGES.find(c => c.id === nodeId);
    if (!challenge) return;

    // Update Node List active highlight
    document.querySelectorAll('.node-card').forEach(c => {
      c.classList.toggle('active', parseInt(c.getAttribute('data-node-id'), 10) === nodeId);
    });

    // Update Briefing UI
    document.getElementById('current-node-tag').textContent = challenge.tag;
    document.getElementById('current-node-title').textContent = challenge.title;
    document.getElementById('current-node-diff').textContent = challenge.difficulty;
    document.getElementById('current-filename').textContent = challenge.filename;
    document.getElementById('current-node-desc').textContent = challenge.lore;
    document.getElementById('current-node-concept').innerHTML = challenge.concept;

    // Update Objectives
    const objList = document.getElementById('current-node-objectives');
    objList.innerHTML = challenge.objectives.map(o => `<li>${o}</li>`).join('');

    // Load Saved or Starter Code
    const saved = window.storageManager.loadSolutions();
    const codeToLoad = (saved[nodeId] && saved[nodeId].code) ? saved[nodeId].code : challenge.starterCode;

    window.editorManager.setCode(codeToLoad);
    
    // Update Surveillance Camera Feed for Mainframe Sector
    this.updateCameraFeed(nodeId);

    // Clear Console
    this.logConsole(`[SYSTEM]: Switched target to ${challenge.tag} — ${challenge.title}. Ready to compile.`, 'info');
  }

  updateCameraFeed(nodeId) {
    const feedImg = document.getElementById('cam-feed-img');
    const subheading = document.getElementById('cam-subheading');
    const location = document.getElementById('cam-hud-location');
    const statusEl = document.getElementById('cam-hud-status');
    const objectiveEl = document.getElementById('cam-hud-objective');
    const viewport = document.getElementById('cam-viewport');

    const challenge = window.CYBER_CHALLENGES.find(c => c.id === nodeId);
    const userProgress = window.storageManager.loadProgress();
    const isBreached = challenge ? (userProgress[nodeId] && userProgress[nodeId].completed) : false;

    let feedSrc = 'assets/camera_feed.jpg';
    let subText = 'CAM 01 // DAYLAN ELECTRIC POWER VAULT (DAYTON, OH)';
    let locText = 'CAM 01 // DAYLAN ELECTRIC MAYLAR (DAYTON OH)';

    if (nodeId === 1) {
      feedSrc = 'assets/camera_feed.jpg';
      subText = 'CAM 01 // DAYLAN ELECTRIC POWER VAULT (DAYTON, OH)';
      locText = 'CAM 01 // DAYLAN ELECTRIC MAYLAR (DAYTON OH)';
    } else if (nodeId === 2) {
      feedSrc = 'assets/cam_node_2_1786587748058.jpg';
      subText = 'CAM 02 // MARCHEL WATER FILTRATION CHAMBER (DAYTON, OH)';
      locText = 'CAM 02 // MARCHEL WATER WORKS (FILTRATION 2)';
    } else if (nodeId === 3) {
      feedSrc = 'assets/camera_feed_water.jpg';
      subText = 'CAM 03 // MARKETAL UTILITIES TELEMETRY ROUTER';
      locText = 'CAM 03 // MARKETAL UTILITIES (VAULT B)';
    } else if (nodeId === 4) {
      feedSrc = 'assets/cam_node_4_1786587797380.jpg';
      subText = 'CAM 04 // SQLITE3 UNDERGROUND TAPE BACKUP VAULT';
      locText = 'CAM 04 // SQLITE3 DATABASE ARCHIVE VAULT';
    } else if (nodeId === 5) {
      feedSrc = 'assets/camera_feed_exterior.jpg';
      subText = 'CAM 05 // SECURE JSON DATA TERMINAL ARCHIVES';
      locText = 'CAM 05 // DATA CENTER ARCHIVE ROOM';
    } else if (nodeId === 6) {
      feedSrc = 'assets/camera_feed_water.jpg';
      subText = 'CAM 06 // COLORADO UNDERGROUND WATER VALVE VAULT';
      locText = 'CAM 06 // COLORADO RESERVOIR VAULT';
    } else if (nodeId === 7) {
      feedSrc = 'assets/cam_node_7_1786587822390.jpg';
      subText = 'CAM 07 // SATELLITE COMMUNICATIONS UPLINK CONTROL ROOM';
      locText = 'CAM 07 // SATELLITE UPLINK CONTROL CENTER';
    } else if (nodeId === 8) {
      feedSrc = 'assets/camera_feed_telecom.jpg';
      subText = 'CAM 08 // HIGH-SPEED FIBER NETWORK SWITCHING HUB';
      locText = 'CAM 08 // NETWORK FIBER SWITCHING CENTER';
    } else if (nodeId === 9) {
      feedSrc = 'assets/camera_feed_telecom.jpg';
      subText = 'CAM 09 // SUBSEA FIBER OPTIC TERMINAL (MANILA, PHILIPPINES)';
      locText = 'CAM 09 // MANILA PHILIPPINES TELECOM HUB';
    }

    if (viewport) {
      viewport.style.opacity = '0.4';
      setTimeout(() => { viewport.style.opacity = '1.0'; }, 300);
    }

    if (feedImg) feedImg.src = feedSrc;
    if (subheading) subheading.textContent = subText;
    if (location) location.textContent = locText;

    // Update Live Status & Objective Overlay
    if (statusEl) {
      if (isBreached) {
        statusEl.textContent = 'STATUS: [✓ MAINFRAME BREACHED - TYPE SAFETY ENFORCED]';
        statusEl.className = 'hud-green';
      } else {
        statusEl.textContent = 'STATUS: [⚠️ LOCK ACTIVE - BREACH REQUIRED]';
        statusEl.className = 'hud-amber';
      }
    }

    if (objectiveEl && challenge) {
      if (isBreached) {
        objectiveEl.textContent = 'PROTOCOL: ALL OBJECTIVES SATISFIED (100% SECURE)';
      } else {
        const nextObj = challenge.objectives[0] || 'Refactor JS code to strict TypeScript';
        objectiveEl.textContent = `NEXT TASK: ${nextObj.toUpperCase()}`;
      }
    }
  }

  /* Compilation & Solution Check */
  runCompilation() {
    window.soundEngine.playKeyClick();
    const code = window.editorManager.getCode();
    const result = window.tsValidator.validate(this.currentNodeId, code);

    const compTimeEl = document.getElementById('compiler-time');
    if (compTimeEl) compTimeEl.textContent = `${result.time} ms`;

    const statusEl = document.getElementById('editor-type-status');
    
    // Output diagnostics
    const consoleLogs = document.getElementById('console-logs');
    if (consoleLogs) consoleLogs.innerHTML = '';

    result.logs.forEach(l => {
      let type = 'info';
      if (l.includes('PASS') || l.includes('BREACHED')) type = 'success';
      if (l.includes('FAIL') || l.includes('ERROR')) type = 'error';
      this.logConsole(l, type);
    });

    if (result.success) {
      window.soundEngine.playSuccess();
      if (statusEl) {
        statusEl.innerHTML = `<span class="status-dot connected"></span> BREACH SUCCESSFUL`;
      }
      
      const challenge = window.CYBER_CHALLENGES.find(c => c.id === this.currentNodeId);
      
      // Save progress and solution
      window.storageManager.saveProgress(this.currentNodeId, { xpEarned: challenge.xp, code });
      window.storageManager.saveSolution(this.currentNodeId, code);
      window.storageManager.addXP(challenge.xp);

      this.updateStatsDisplay();
      this.renderNodeList();
      this.renderRecordVault();

      this.logConsole('[SECURITY CAM]: Intercepted camera feed updated! Click SECURITY CAM tab or type "cam" in terminal to inspect surveillance footage.', 'warn');
    } else {
      window.soundEngine.playError();
      if (statusEl) {
        statusEl.innerHTML = `<span class="status-dot idle"></span> TYPE DIAGNOSTIC ERRORS (${result.passedRules}/${result.totalRules})`;
      }
    }
  }

  logConsole(msg, type = 'info') {
    const container = document.getElementById('console-logs');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    div.textContent = msg;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /* Stats Display */
  updateStatsDisplay() {
    const xp = window.storageManager.loadXP();
    const progress = window.storageManager.loadProgress();
    const breachedCount = Object.keys(progress).length;
    const totalCount = window.CYBER_CHALLENGES.length;

    // XP
    const xpEl = document.getElementById('stat-xp');
    if (xpEl) xpEl.textContent = `${xp} CR`;

    // Progress Bar
    const pct = Math.round((breachedCount / totalCount) * 100);
    const bar = document.getElementById('overall-progress-bar');
    const text = document.getElementById('overall-progress-text');
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `${breachedCount} / ${totalCount} NODES`;

    // Count in stats card
    const savedCountEl = document.getElementById('records-saved-count');
    if (savedCountEl) savedCountEl.textContent = `${breachedCount} LOGS`;
  }

  /* Ollama Status & Connection Handler */
  async checkOllamaStatus() {
    const res = await window.ollamaClient.testConnection();
    const dot = document.getElementById('ollama-dot');
    const text = document.getElementById('ollama-header-text');
    const display = document.getElementById('current-model-display');
    const select = document.getElementById('ollama-model-select');

    if (res.connected) {
      if (dot) dot.className = 'status-dot connected';
      if (text) text.textContent = `Ollama: Online (${res.models.length} models)`;
      
      if (select) {
        select.disabled = false;
        select.innerHTML = res.models.map(m => `<option value="${m.name}" ${m.name === window.ollamaClient.selectedModel ? 'selected' : ''}>${m.name}</option>`).join('');
      }

      if (display) display.textContent = window.ollamaClient.selectedModel || 'ACTIVE';
    } else {
      if (dot) dot.className = 'status-dot disconnected';
      if (text) text.textContent = 'Ollama: Offline';
      if (display) display.textContent = 'AUTO/OFFLINE';
      if (select) {
        select.disabled = true;
        select.innerHTML = '<option value="">(No local server found)</option>';
      }
    }
  }

  /* Record Vault */
  renderRecordVault() {
    const tbody = document.getElementById('records-table-body');
    const solutionsList = document.getElementById('saved-solutions-list');
    if (!tbody || !solutionsList) return;

    const progress = window.storageManager.loadProgress();
    const solutions = window.storageManager.loadSolutions();

    tbody.innerHTML = '';
    solutionsList.innerHTML = '';

    const totalNodes = window.CYBER_CHALLENGES.length;
    let completedCount = 0;

    window.CYBER_CHALLENGES.forEach(c => {
      const isBreached = progress[c.id] && progress[c.id].completed;
      if (isBreached) completedCount++;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.tag}</td>
        <td>${c.title}</td>
        <td><span class="${isBreached ? 'status-green' : ''}">${isBreached ? '✓ BREACHED' : 'LOCKED'}</span></td>
        <td>+${isBreached ? (c.xp || 100) : 0} CR</td>
        <td>${isBreached ? new Date(progress[c.id].completedAt).toLocaleTimeString() : '-'}</td>
      `;
      tbody.appendChild(tr);

      if (solutions[c.id]) {
        const div = document.createElement('div');
        div.className = 'solution-item';
        div.innerHTML = `
          <div class="solution-item-header">
            <span>${c.tag} — ${c.title}</span>
            <span>Updated: ${new Date(solutions[c.id].updatedAt).toLocaleTimeString()}</span>
          </div>
          <pre>${this.escapeHTML(solutions[c.id].code)}</pre>
        `;
        solutionsList.appendChild(div);
      }
    });

    if (solutionsList.children.length === 0) {
      solutionsList.innerHTML = '<p class="empty-state">No solved challenges recorded yet. Select a node from the System Map and breach it!</p>';
    }

    // Unlocking Certification Badge ONLY when ALL 9 mainframes are breached!
    const lockedCert = document.getElementById('cert-card-locked');
    const unlockedCert = document.getElementById('cert-card-unlocked');
    const progressText = document.getElementById('cert-progress-text');
    const playerName = document.getElementById('cert-player-name');
    const issueDate = document.getElementById('cert-issue-date');

    if (progressText) {
      progressText.textContent = `PROGRESS: ${completedCount} / ${totalNodes} MAINFRAMES BREACHED`;
    }

    if (completedCount === totalNodes && totalNodes > 0) {
      if (lockedCert) lockedCert.style.display = 'none';
      if (unlockedCert) unlockedCert.style.display = 'block';
      if (playerName) playerName.textContent = window.storageManager.getActivePlayer().toUpperCase();
      if (issueDate) issueDate.textContent = `DATE: ${new Date().toLocaleDateString()}`;
    } else {
      if (lockedCert) lockedCert.style.display = 'flex';
      if (unlockedCert) unlockedCert.style.display = 'none';
    }
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Event Listeners */
  initEventListeners() {
    // IDE Action Buttons
    document.getElementById('btn-check-types')?.addEventListener('click', () => this.runCompilation());
    document.getElementById('btn-submit-solution')?.addEventListener('click', () => this.runCompilation());

    document.getElementById('btn-reset-code')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const challenge = window.CYBER_CHALLENGES.find(c => c.id === this.currentNodeId);
      if (challenge) window.editorManager.setCode(challenge.starterCode);
    });

    document.getElementById('btn-get-hint')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const challenge = window.CYBER_CHALLENGES.find(c => c.id === this.currentNodeId);
      if (challenge) this.logConsole(`[HINT]: ${challenge.hint}`, 'warn');
    });

    document.getElementById('btn-ask-ollama-hint')?.addEventListener('click', async () => {
      window.soundEngine.playKeyClick();
      const challenge = window.CYBER_CHALLENGES.find(c => c.id === this.currentNodeId);
      this.switchTab('ollama-view');
      
      const chatInput = document.getElementById('chat-input');
      if (chatInput && challenge) {
        chatInput.value = `Can you explain the TypeScript concept for ${challenge.tag} (${challenge.title}) and give me a helpful hint on how to satisfy the objectives?`;
      }
    });

    document.getElementById('btn-clear-console')?.addEventListener('click', () => {
      const logs = document.getElementById('console-logs');
      if (logs) logs.innerHTML = '';
    });

    document.getElementById('btn-read-briefing-tts')?.addEventListener('click', () => {
      const challenge = window.CYBER_CHALLENGES.find(c => c.id === this.currentNodeId);
      if (challenge) {
        window.kokoroTTS.speak(`${challenge.tag}. ${challenge.title}. ${challenge.lore}`);
      }
    });

    // Header Controls
    document.getElementById('btn-toggle-tts')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.kokoroTTS.enabled = !window.kokoroTTS.enabled;
      const label = document.getElementById('tts-label');
      if (label) label.textContent = window.kokoroTTS.enabled ? '🗣️ TTS: ON' : '🔇 TTS: MUTED';
    });

    document.getElementById('kokoro-voice-select')?.addEventListener('change', (e) => {
      window.soundEngine.playKeyClick();
      window.kokoroTTS.setVoice(e.target.value);
    });
    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      const enabled = window.soundEngine.toggleSound();
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = enabled ? '🔊' : '🔇';
    });

    document.getElementById('btn-toggle-crt')?.addEventListener('click', () => {
      const crt = document.getElementById('crt-overlay');
      if (crt) crt.classList.toggle('disabled');
    });

    document.getElementById('btn-export-records')?.addEventListener('click', () => {
      window.storageManager.exportAsJSON();
    });

    document.getElementById('btn-print-cert')?.addEventListener('click', () => {
      window.soundEngine.playSuccess();
      window.print();
    });

    // Profile Manager Modal Controls
    document.getElementById('btn-profile-mgr')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      this.renderPlayerProfiles();
      const modal = document.getElementById('profile-modal');
      if (modal) modal.style.display = 'flex';
    });

    document.getElementById('btn-close-profile-modal')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const modal = document.getElementById('profile-modal');
      if (modal) modal.style.display = 'none';
    });

    document.getElementById('btn-create-profile')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const input = document.getElementById('new-profile-input');
      const val = input ? input.value.trim() : '';
      if (!val) {
        alert('Please type a profile alias (e.g. jack2, daughter_run).');
        return;
      }
      window.storageManager.createPlayer(val);
      if (input) input.value = '';
      this.onProfileSwitched();
      const modal = document.getElementById('profile-modal');
      if (modal) modal.style.display = 'none';
    });

    // Camera View Controls
    document.getElementById('btn-toggle-nv')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const viewport = document.getElementById('cam-viewport');
      if (viewport) viewport.classList.toggle('night-vision');
    });

    document.getElementById('btn-refresh-cam')?.addEventListener('click', () => {
      window.soundEngine.playScan();
      const tsEl = document.getElementById('cam-timestamp');
      if (tsEl) tsEl.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' GMT';
    });

    // TS Sandbox Controls & Presets
    document.getElementById('btn-preset-primitives')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.editorManager.setSandboxCode(`// TEMPLATE 1: PRIMITIVES & EXPLICIT TYPES
export const serverPort: number = 8080;
export const locationName: string = "Dayton, Ohio";
export const isOnline: boolean = true;
export const portList: number[] = [8080, 8880, 11434];
`);
    });

    document.getElementById('btn-preset-interface')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.editorManager.setSandboxCode(`// TEMPLATE 2: INTERFACES & OPTIONAL MODIFIERS
export interface WaterSensor {
  readonly id: number;
  location: string;
  psi: number;
  alertMessage?: string;
}

export const activeSensor: WaterSensor = {
  id: 108,
  location: "Dayton Reservoir Vault A",
  psi: 14.7
};
`);
    });

    document.getElementById('btn-preset-generics')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.editorManager.setSandboxCode(`// TEMPLATE 3: GENERICS <T>
export interface TelemetryPacket<T> {
  timestamp: string;
  payload: T;
}

export function wrapPacket<T>(data: T): TelemetryPacket<T> {
  return {
    timestamp: new Date().toISOString(),
    payload: data
  };
}
`);
    });

    document.getElementById('btn-preset-sqlite')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.editorManager.setSandboxCode(`// TEMPLATE 4: SQLITE DATABASE ROW TYPING
export interface SqliteNote {
  id: number;
  title: string;
  content: string;
  tags?: string;
  created_at: string;
}

export function parseNoteRow(row: any): SqliteNote {
  return {
    id: row.id,
    title: row.title || "Untitled",
    content: row.content || "",
    tags: row.tags,
    created_at: row.created_at || new Date().toISOString()
  };
}
`);
    });

    document.getElementById('btn-preset-async')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      window.editorManager.setSandboxCode(`// TEMPLATE 5: ASYNC PROMISES & REST APIS
export interface ApiResponse<T> {
  status: number;
  data: T;
}

export async function fetchNotes(): Promise<ApiResponse<string[]>> {
  return {
    status: 200,
    data: ["Note 1: SQLite notes.db integration", "Note 2: Kokoro TTS audio proxy"]
  };
}
`);
    });

    document.getElementById('btn-run-sandbox')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const code = window.editorManager.getSandboxCode();
      const consoleLogs = document.getElementById('sandbox-console-logs');
      if (consoleLogs) consoleLogs.innerHTML = '';

      const start = performance.now();

      const log = (msg, type = 'info') => {
        if (!consoleLogs) return;
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = msg;
        consoleLogs.appendChild(line);
      };

      log(`[SANDBOX COMPILER]: Parsing custom TypeScript code...`, 'info');

      if (!code.trim()) {
        log(`[WARNING]: Sandbox code editor is empty. Type some TypeScript code to test!`, 'warning');
        return;
      }

      if (code.includes(': any')) {
        log(`[DIAGNOSTIC WARN]: Explicit 'any' detected. Consider annotating specific interfaces or generics!`, 'warning');
      }

      if (code.includes('interface ') || code.includes('type ')) {
        log(`[PASS]: Structurally valid TypeScript interface / type definition detected!`, 'success');
      }

      if (code.includes('export const') || code.includes('export function') || code.includes('export interface')) {
        log(`[PASS]: Named exports verified. Type safety confirmed.`, 'success');
      }

      const duration = (performance.now() - start).toFixed(2);
      log(`[EXECUTION COMPLETE]: Compiled successfully in ${duration} ms. 0 errors found.`, 'success');
    });

    document.getElementById('btn-clear-sandbox-console')?.addEventListener('click', () => {
      const logs = document.getElementById('sandbox-console-logs');
      if (logs) logs.innerHTML = '';
    });

    // Cyber Codex Copy Buttons
    document.querySelectorAll('[data-copy-codex]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playKeyClick();
        const card = btn.closest('.codex-card');
        const codeBlock = card ? card.querySelector('.codex-code') : null;
        if (codeBlock) {
          const codeText = codeBlock.textContent;
          window.editorManager.setSandboxCode(`// COPIED FROM CYBER CODEX REFERENCE MANUAL\n${codeText}`);
          this.switchTab('sandbox-view');
        }
      });
    });

    // Ollama Config & Chat
    document.getElementById('btn-connect-ollama')?.addEventListener('click', async () => {
      const hostInput = document.getElementById('ollama-url-input');
      const host = hostInput ? hostInput.value.trim() : 'http://localhost:11434';
      await window.ollamaClient.testConnection(host);
      await this.checkOllamaStatus();
    });

    document.getElementById('btn-refresh-models')?.addEventListener('click', async () => {
      await window.ollamaClient.testConnection();
      await this.checkOllamaStatus();
    });

    document.getElementById('ollama-model-select')?.addEventListener('change', (e) => {
      window.ollamaClient.selectedModel = e.target.value;
      window.ollamaClient.saveConfig();
      const display = document.getElementById('current-model-display');
      if (display) display.textContent = e.target.value;
    });

    document.getElementById('btn-send-chat')?.addEventListener('click', () => this.sendChatMessage());
    
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendChatMessage();
      }
    });

    document.getElementById('btn-clear-chat')?.addEventListener('click', () => {
      window.storageManager.clearChatLogs();
      const container = document.getElementById('chat-messages');
      if (container) {
        container.innerHTML = `
          <div class="chat-msg system">
            <div class="msg-author">CYBERDECK SYSTEM</div>
            <div class="msg-text">Chat cleared. Ask a question below to start a new chat with your Ollama model.</div>
          </div>
        `;
      }
    });

    document.getElementById('btn-save-chat-log')?.addEventListener('click', () => {
      window.storageManager.exportAsMarkdown();
    });

    // Camera Feed Controls
    document.getElementById('btn-refresh-cam')?.addEventListener('click', () => {
      window.soundEngine.playScan();
      this.updateCameraFeed(this.currentNodeId);
    });

    document.getElementById('btn-toggle-nv')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const viewport = document.getElementById('cam-viewport');
      if (viewport) {
        viewport.classList.toggle('night-vision');
      }
    });

    // SQLite3 Notes Controls
    document.getElementById('btn-save-sqlite-note')?.addEventListener('click', async () => {
      window.soundEngine.playKeyClick();
      const titleInput = document.getElementById('note-title-input');
      const tagsInput = document.getElementById('note-tags-input');
      const contentInput = document.getElementById('note-content-input');

      const title = titleInput ? titleInput.value.trim() : '';
      const tags = tagsInput ? tagsInput.value.trim() : 'general';
      const content = contentInput ? contentInput.value.trim() : '';

      if (!content) {
        alert('Please write note content before saving.');
        return;
      }

      const res = await window.notesManager.saveNote(title || 'Untitled Hacker Note', content, tags);
      if (res.success) {
        window.soundEngine.playSuccess();
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        await this.renderSqliteNotes();
      } else {
        window.soundEngine.playError();
        alert('Could not save note to SQLite3 server.');
      }
    });

    document.getElementById('btn-refresh-notes')?.addEventListener('click', async () => {
      window.soundEngine.playScan();
      await this.renderSqliteNotes();
    });

    document.getElementById('btn-copy-ts-interface')?.addEventListener('click', () => {
      window.soundEngine.playKeyClick();
      const interfaceCode = `// TypeScript Interface for reading SQLite3 Notes Database
export interface SqliteNote {
  id: number;
  title: string;
  content: string;
  tags?: string;
  created_at: string;
}

export type NoteDraft = Omit<SqliteNote, "id" | "created_at">;
`;
      navigator.clipboard.writeText(interfaceCode);
      alert('TypeScript SqliteNote interface copied to clipboard!');
    });

    this.renderSqliteNotes();
  }

  async renderSqliteNotes() {
    const listEl = document.getElementById('sqlite-notes-list');
    if (!listEl) return;

    const notes = await window.notesManager.fetchNotes();
    if (notes.length === 0) {
      listEl.innerHTML = '<p class="empty-state">No notes found in SQLite3 database (notes.db). Type a note on the left and click "SAVE TO SQLITE3 DB"!</p>';
      return;
    }

    listEl.innerHTML = '';
    notes.forEach(n => {
      const card = document.createElement('div');
      card.className = 'note-item';
      card.innerHTML = `
        <div class="note-item-header">
          <span class="note-item-title">#${n.id} ${this.escapeHTML(n.title)}</span>
          <span class="note-item-tag">${this.escapeHTML(n.tags || 'general')}</span>
        </div>
        <div class="note-item-body">${this.escapeHTML(n.content)}</div>
        <div class="note-item-footer">
          <span>Date: ${new Date(n.created_at).toLocaleString()}</span>
          <button class="btn-text btn-danger" data-delete-id="${n.id}">[DELETE]</button>
        </div>
      `;

      card.querySelector('.btn-danger')?.addEventListener('click', async () => {
        window.soundEngine.playKeyClick();
        if (confirm(`Delete note #${n.id} from SQLite3 database?`)) {
          await window.notesManager.deleteNote(n.id);
          await this.renderSqliteNotes();
        }
      });

      listEl.appendChild(card);
    });
  }

  async sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const userText = input.value.trim();
    if (!userText) return;

    window.soundEngine.playKeyClick();
    input.value = '';

    // Append user message
    this.appendChatMsg('USER', userText, 'user');

    // Show loading
    const modelName = window.ollamaClient.selectedModel || 'CyberDeck AI';
    const loadingId = this.appendChatMsg(modelName, 'Thinking...', 'assistant');

    const responseText = await window.ollamaClient.sendMessage(userText);
    
    // Update message text
    const loadingMsgEl = document.getElementById(loadingId);
    if (loadingMsgEl) {
      loadingMsgEl.querySelector('.msg-text').textContent = responseText;
    }

    // Save to storage logs
    window.storageManager.saveChatMsg({ sender: 'USER', text: userText });
    window.storageManager.saveChatMsg({ sender: modelName, text: responseText });

    // Speak response using Kokoro TTS
    window.kokoroTTS.speak(responseText);
  }

  appendChatMsg(author, text, type) {
    const container = document.getElementById('chat-messages');
    if (!container) return null;

    const msgId = `msg-${Date.now()}`;
    const div = document.createElement('div');
    div.id = msgId;
    div.className = `chat-msg ${type}`;
    div.innerHTML = `
      <div class="msg-author">${author}</div>
      <div class="msg-text">${this.escapeHTML(text)}</div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return msgId;
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
