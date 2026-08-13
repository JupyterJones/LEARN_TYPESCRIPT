/* TS-HACK // CodeMirror 5 Dual-Instance Engine (IDE & Sandbox) */

class CodeEditorManager {
  constructor() {
    this.cm = null;
    this.sandboxCm = null;
  }

  init() {
    // 1. Initialize Main IDE CodeMirror instance
    const target = document.getElementById('code-editor-target');
    if (target) {
      this.cm = CodeMirror.fromTextArea(target, {
        mode: 'text/typescript',
        theme: 'default',
        lineNumbers: true,
        tabSize: 2,
        indentUnit: 2,
        smartIndent: true,
        lineWrapping: false,
        viewportMargin: Infinity
      });

      this.cm.on('keydown', () => {
        if (window.soundEngine) window.soundEngine.playKeyClick();
      });
    }

    // 2. Initialize Sandbox CodeMirror instance
    const sandboxTarget = document.getElementById('sandbox-editor-target');
    if (sandboxTarget) {
      this.sandboxCm = CodeMirror.fromTextArea(sandboxTarget, {
        mode: 'text/typescript',
        theme: 'default',
        lineNumbers: true,
        tabSize: 2,
        indentUnit: 2,
        smartIndent: true,
        lineWrapping: false,
        viewportMargin: Infinity
      });

      this.sandboxCm.on('keydown', () => {
        if (window.soundEngine) window.soundEngine.playKeyClick();
      });

      this.sandboxCm.setValue(`// TS-HACK // TYPESCRIPT SANDBOX PLAYGROUND
// Write custom code, experiment with types, or click a preset template above!

export const hackerAlias: string = "${window.storageManager ? window.storageManager.getActivePlayer() : 'jack1'}";
export const maxAttempts: number = 999;
export const isSandboxActive: boolean = true;

export interface SystemStatus {
  active: boolean;
  cpuLoadPercentage: number;
}

export function checkStatus(): SystemStatus {
  return {
    active: true,
    cpuLoadPercentage: 12.5
  };
}
`);
    }

    setTimeout(() => {
      if (this.cm) this.cm.refresh();
      if (this.sandboxCm) this.sandboxCm.refresh();
    }, 100);
  }

  setCode(code) {
    if (this.cm) {
      this.cm.setValue(code);
      setTimeout(() => this.cm.refresh(), 50);
    }
  }

  getCode() {
    return this.cm ? this.cm.getValue() : '';
  }

  setSandboxCode(code) {
    if (this.sandboxCm) {
      this.sandboxCm.setValue(code);
      setTimeout(() => this.sandboxCm.refresh(), 50);
    }
  }

  getSandboxCode() {
    return this.sandboxCm ? this.sandboxCm.getValue() : '';
  }
}

window.editorManager = new CodeEditorManager();
