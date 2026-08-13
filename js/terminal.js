/* TS-HACK // Cyber Terminal CLI Interface */

class CyberTerminal {
  constructor() {
    this.historyContainer = null;
    this.input = null;
  }

  init() {
    this.historyContainer = document.getElementById('term-history');
    this.input = document.getElementById('term-input');

    if (!this.input) return;

    this.input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (!cmd) return;

        window.soundEngine.playKeyClick();
        this.printLine(`cyberdeck@root:~$ ${cmd}`, 'cmd');
        this.input.value = '';

        await this.handleCommand(cmd);

        // Auto scroll to bottom
        const termBody = document.getElementById('terminal-body');
        if (termBody) termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  printLine(text, type = 'out') {
    if (!this.historyContainer) return;
    const div = document.createElement('div');
    div.className = `term-line ${type}`;
    div.textContent = text;
    this.historyContainer.appendChild(div);
  }

  printHTML(html) {
    if (!this.historyContainer) return;
    const div = document.createElement('div');
    div.className = `term-line out`;
    div.innerHTML = html;
    this.historyContainer.appendChild(div);
  }

  async handleCommand(rawCmd) {
    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        this.printLine('=== TS-HACK COMMAND MANUAL ===');
        this.printLine('  scan                    List all mainframe nodes and breach statuses');
        this.printLine('  hack <node_id>          Load target mainframe node in IDE editor (e.g. hack 1)');
        this.printLine('  ts-check                Compile & validate currently loaded solution');
        this.printLine('  cam / camera            Intercept live security camera surveillance feed');
        this.printLine('  speak <text>            Synthesize text speech using Kokoro Voice engine');
        this.printLine('  ollama                  Display Ollama connection status');
        this.printLine('  list-models             List all local models installed on Ollama');
        this.printLine('  select-model <name>     Select active Ollama model');
        this.printLine('  chat <msg>              Send question directly to active Ollama model');
        this.printLine('  records                 View session progress & breached counts');
        this.printLine('  export                  Export session records as JSON file');
        this.printLine('  clear                   Clear terminal display output');
        break;

      case 'speak':
        const phrase = args.join(' ');
        if (!phrase) {
          this.printLine('[ERROR]: Usage: speak <text to read aloud>');
        } else {
          this.printLine(`[KOKORO TTS]: Synthesizing voice audio ("${phrase}")...`);
          window.kokoroTTS.speak(phrase);
        }
        break;

      case 'cam':
      case 'camera':
        this.printLine('[SIGNAL INTERCEPTED]: Switching video feed to CAM 07 // VAULT-B...');
        window.soundEngine.playScan();
        window.app.switchTab('camera-view');
        break;

      case 'scan':
        this.printLine('Scanning local grid for mainframes...');
        window.soundEngine.playScan();
        const progress = window.storageManager.loadProgress();
        window.CYBER_CHALLENGES.forEach(c => {
          const isBreached = progress[c.id] && progress[c.id].completed;
          const status = isBreached ? '[✓ BREACHED]' : '[LOCK ACTIVE]';
          this.printLine(`  Node 0${c.id}: ${c.title.padEnd(32)} ${status} (${c.difficulty})`);
        });
        break;

      case 'hack':
        const targetId = parseInt(args[0], 10);
        if (isNaN(targetId) || targetId < 1 || targetId > window.CYBER_CHALLENGES.length) {
          this.printLine('[ERROR]: Invalid node ID. Usage: hack <1-6>');
        } else {
          this.printLine(`Initializing hack sequence for NODE 0${targetId}...`);
          window.app.loadNode(targetId);
          window.app.switchTab('ide-view');
        }
        break;

      case 'ts-check':
        this.printLine('Executing TypeScript compilation pipeline...');
        window.app.runCompilation();
        break;

      case 'cam':
      case 'camera':
        window.soundEngine.playScan();
        const camNum = parseInt(args[0], 10);
        if (camNum >= 1 && camNum <= 4) {
          const nodeMap = { 1: 1, 2: 5, 3: 7, 4: 0 };
          window.app.updateCameraFeed(nodeMap[camNum]);
          this.printLine(`[SECURITY FEED]: Switched live feed to CAM 0${camNum}.`);
        } else {
          this.printLine(`[SECURITY FEED]: Intercepted live surveillance feeds available:`);
          this.printLine(`  cam 1: CAM 01 // DAYLAN ELECTRIC POWER VAULT (DAYTON, OH)`);
          this.printLine(`  cam 2: CAM 02 // MARCHEL WATER PUMP VAULT (COLORADO & DAYTON, OH)`);
          this.printLine(`  cam 3: CAM 03 // SUBSEA FIBER TERMINAL (MANILA, PHILIPPINES)`);
          this.printLine(`  cam 4: CAM 04 // CORPORATE DATA CENTER EXTERIOR COMPOUND`);
          this.printLine(`Usage: cam <1-4>`);
        }
        window.app.switchTab('camera-view');
        break;

      case 'ollama':
        this.printLine(`Ollama Host: ${window.ollamaClient.host}`);
        this.printLine(`Status: ${window.ollamaClient.isConnected ? 'ONLINE' : 'OFFLINE'}`);
        this.printLine(`Active Model: ${window.ollamaClient.selectedModel || 'None (Using Offline Assistant)'}`);
        break;

      case 'list-models':
        this.printLine('Querying local Ollama server tags...');
        const res = await window.ollamaClient.testConnection();
        if (res.connected && res.models.length > 0) {
          this.printLine('Found local models:');
          res.models.forEach(m => this.printLine(`  - ${m.name}`));
        } else {
          this.printLine('[OFFLINE]: Could not list models. Make sure Ollama server is running (ollama serve).');
        }
        break;

      case 'select-model':
        if (!args[0]) {
          this.printLine('[ERROR]: Please specify model name. Usage: select-model <model_name>');
        } else {
          window.ollamaClient.selectedModel = args[0];
          window.ollamaClient.saveConfig();
          this.printLine(`[SUCCESS]: Active Ollama model set to "${args[0]}".`);
        }
        break;

      case 'chat':
        const msg = args.join(' ');
        if (!msg) {
          this.printLine('[ERROR]: Usage: chat <your question>');
        } else {
          this.printLine('[OLLAMA AI THINKING...]');
          const reply = await window.ollamaClient.sendMessage(msg);
          this.printLine(reply);
        }
        break;

      case 'records':
        const xp = window.storageManager.loadXP();
        const userProgress = window.storageManager.loadProgress();
        const count = Object.keys(userProgress).length;
        this.printLine(`Total Cyber Credits: ${xp} CR`);
        this.printLine(`Breached Mainframes: ${count} / ${window.CYBER_CHALLENGES.length}`);
        break;

      case 'export':
        this.printLine('Exporting session records to JSON download...');
        window.storageManager.exportAsJSON();
        break;

      case 'clear':
        if (this.historyContainer) this.historyContainer.innerHTML = '';
        break;

      default:
        this.printLine(`[ERROR]: Unknown command '${cmd}'. Type 'help' for available commands.`);
        break;
    }
  }
}

window.cyberTerminal = new CyberTerminal();
