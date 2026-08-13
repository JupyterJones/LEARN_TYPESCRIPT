/* TS-HACK // Multi-Player Storage & Profile Isolation Engine */

class StorageManager {
  constructor() {
    this.KEY_PROFILES_LIST = 'tshack_player_profiles_list_v3';
    this.KEY_ACTIVE_PLAYER = 'tshack_active_player_handle_v3';
    
    // Ensure default profile 'jack1' exists
    this.initProfiles();
  }

  initProfiles() {
    let profiles = this.getProfiles();
    if (!profiles || profiles.length === 0) {
      profiles = ['jack1'];
      localStorage.setItem(this.KEY_PROFILES_LIST, JSON.stringify(profiles));
    }
    
    let active = localStorage.getItem(this.KEY_ACTIVE_PLAYER);
    if (!active || !profiles.includes(active)) {
      active = profiles[0];
      localStorage.setItem(this.KEY_ACTIVE_PLAYER, active);
    }
    
    this.activePlayer = active;
  }

  getProfiles() {
    const raw = localStorage.getItem(this.KEY_PROFILES_LIST);
    return raw ? JSON.parse(raw) : ['jack1'];
  }

  getActivePlayer() {
    return this.activePlayer || 'jack1';
  }

  switchPlayer(handle) {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const profiles = this.getProfiles();
    if (profiles.includes(cleanHandle)) {
      this.activePlayer = cleanHandle;
      localStorage.setItem(this.KEY_ACTIVE_PLAYER, cleanHandle);
      console.log(`[STORAGE]: Switched active player profile to "${cleanHandle}"`);
      return true;
    }
    return false;
  }

  createPlayer(handle) {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanHandle) return false;

    const profiles = this.getProfiles();
    if (!profiles.includes(cleanHandle)) {
      profiles.push(cleanHandle);
      localStorage.setItem(this.KEY_PROFILES_LIST, JSON.stringify(profiles));
    }
    this.switchPlayer(cleanHandle);
    return true;
  }

  deletePlayer(handle) {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    let profiles = this.getProfiles();
    
    if (profiles.length <= 1) {
      console.warn('[STORAGE]: Cannot delete the only remaining profile.');
      return false;
    }

    if (profiles.includes(cleanHandle)) {
      // Remove profile keys
      localStorage.removeItem(`tshack_${cleanHandle}_progress_v3`);
      localStorage.removeItem(`tshack_${cleanHandle}_solutions_v3`);
      localStorage.removeItem(`tshack_${cleanHandle}_chat_v3`);
      localStorage.removeItem(`tshack_${cleanHandle}_xp_v3`);

      profiles = profiles.filter(p => p !== cleanHandle);
      localStorage.setItem(this.KEY_PROFILES_LIST, JSON.stringify(profiles));

      if (this.activePlayer === cleanHandle) {
        this.switchPlayer(profiles[0]);
      }
      return true;
    }
    return false;
  }

  // Scoped Storage Keys Per Player
  getKey(type) {
    return `tshack_${this.getActivePlayer()}_${type}_v3`;
  }

  loadProgress() {
    const raw = localStorage.getItem(this.getKey('progress'));
    return raw ? JSON.parse(raw) : {};
  }

  saveProgress(nodeId, data) {
    const progress = this.loadProgress();
    progress[nodeId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      xpEarned: data.xpEarned || 100,
      code: data.code
    };
    localStorage.setItem(this.getKey('progress'), JSON.stringify(progress));
  }

  loadSolutions() {
    const raw = localStorage.getItem(this.getKey('solutions'));
    return raw ? JSON.parse(raw) : {};
  }

  saveSolution(nodeId, code) {
    const solutions = this.loadSolutions();
    solutions[nodeId] = {
      code,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.getKey('solutions'), JSON.stringify(solutions));
  }

  loadXP() {
    const raw = localStorage.getItem(this.getKey('xp'));
    return raw ? parseInt(raw, 10) : 0;
  }

  addXP(amount) {
    const current = this.loadXP();
    const next = current + amount;
    localStorage.setItem(this.getKey('xp'), next.toString());
    return next;
  }

  loadOllamaConfig() {
    const raw = localStorage.getItem('tshack_ollama_config_v3');
    return raw ? JSON.parse(raw) : { host: 'http://localhost:11434', model: '' };
  }

  saveOllamaConfig(config) {
    localStorage.setItem('tshack_ollama_config_v3', JSON.stringify(config));
  }

  loadChatLogs() {
    const raw = localStorage.getItem(this.getKey('chat'));
    return raw ? JSON.parse(raw) : [];
  }

  saveChatMsg(msg) {
    const logs = this.loadChatLogs();
    logs.push({
      ...msg,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(this.getKey('chat'), JSON.stringify(logs));
  }

  clearChatLogs() {
    localStorage.setItem(this.getKey('chat'), JSON.stringify([]));
  }

  clearAllRecords() {
    localStorage.removeItem(this.getKey('progress'));
    localStorage.removeItem(this.getKey('solutions'));
    localStorage.removeItem(this.getKey('chat'));
    localStorage.removeItem(this.getKey('xp'));
  }

  exportAsJSON() {
    const data = {
      appName: 'TS-HACK Cyberpunk Terminal',
      playerProfile: this.getActivePlayer(),
      exportDate: new Date().toISOString(),
      userXP: this.loadXP(),
      nodeProgress: this.loadProgress(),
      savedSolutions: this.loadSolutions(),
      ollamaChatHistory: this.loadChatLogs(),
      ollamaConfig: this.loadOllamaConfig()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TS-HACK_${this.getActivePlayer()}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportAsMarkdown() {
    const player = this.getActivePlayer();
    const xp = this.loadXP();
    const progress = this.loadProgress();
    const solutions = this.loadSolutions();
    const chats = this.loadChatLogs();

    let md = `# ⚡ TS-HACK MISSION REPORT — PLAYER: ${player.toUpperCase()}\n`;
    md += `**Export Date:** ${new Date().toLocaleString()}\n`;
    md += `**Total Cyber Credits:** ${xp} CR\n\n`;

    md += `## 🌐 BREACHED MAINFRAMES & SOLVED CHALLENGES\n\n`;
    Object.keys(progress).forEach(id => {
      const p = progress[id];
      const sol = solutions[id];
      md += `### Node 0${id} [COMPLETED]\n`;
      md += `- **Breach Time:** ${new Date(p.completedAt).toLocaleString()}\n`;
      md += `- **Credits Earned:** +${p.xpEarned} CR\n\n`;
      md += `\`\`\`typescript\n${sol ? sol.code : '// No code saved'}\n\`\`\`\n\n`;
    });

    md += `## 🤖 OLLAMA AI ASSISTANT CHAT LOGS\n\n`;
    chats.forEach(c => {
      md += `**[${c.timestamp ? new Date(c.timestamp).toLocaleTimeString() : 'LOG'}] ${c.sender}:**\n${c.text}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TS-HACK_${player}_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

window.storageManager = new StorageManager();
