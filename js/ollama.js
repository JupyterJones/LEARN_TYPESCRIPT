/* TS-HACK // Ollama Local API Bridge & Cyber AI Assistant */

class OllamaClient {
  constructor() {
    const savedConfig = window.storageManager.loadOllamaConfig();
    this.host = savedConfig.host || 'http://localhost:11434';
    this.selectedModel = savedConfig.model || '';
    this.availableModels = [];
    this.isConnected = false;
  }

  async testConnection(customHost = null) {
    const targetHost = customHost || this.host;
    try {
      const response = await fetch(`${targetHost}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        this.host = targetHost;
        this.isConnected = true;
        this.availableModels = data.models || [];
        if (this.availableModels.length > 0 && !this.selectedModel) {
          this.selectedModel = this.availableModels[0].name;
        }
        this.saveConfig();
        return { connected: true, models: this.availableModels };
      }
    } catch (err) {
      this.isConnected = false;
    }
    return { connected: false, models: [] };
  }

  saveConfig() {
    window.storageManager.saveOllamaConfig({
      host: this.host,
      model: this.selectedModel
    });
  }

  async sendMessage(userMessage, systemPrompt = '', onChunk = null) {
    if (!this.isConnected || !this.selectedModel) {
      return this.offlineFallbackResponse(userMessage);
    }

    const defaultSystem = `You are CyberDeck TS-AI, a veteran cyberpunk hacker and expert TypeScript mentor in the TS-HACK mainframe simulator. Keep responses concise, helpful, and focused on strict TypeScript concepts, interface design, generics, and debugging type errors.`;
    const finalSystem = systemPrompt || defaultSystem;

    try {
      const response = await fetch(`${this.host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.selectedModel,
          prompt: userMessage,
          system: finalSystem,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response || '[Ollama]: Empty response received.';
      } else {
        return `[Ollama Error]: HTTP ${response.status} from model server.`;
      }
    } catch (err) {
      return this.offlineFallbackResponse(userMessage);
    }
  }

  offlineFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hint') || msg.includes('node') || msg.includes('help')) {
      return `🤖 [CyberDeck AI (Offline Mode)]:
Here's a TypeScript tip for mainframes:
1. Primitive Vault (Node 01): Use explicit type signatures \`export const id: number = 2049;\`.
2. Interfaces (Node 02): \`interface Hacker { readonly id: number; clearance?: number; }\`.
3. Generics (Node 03): \`function wrap<T>(item: T): CyberResponse<T>\`.
4. Utility Types (Node 04): \`Pick<T, K>\`, \`Omit<T, K>\`, \`Partial<T>\`, \`Record<K, V>\`.
5. Type Guards (Node 05): Return type predicate \`val is string\` and switch on \`evt.kind\`.
6. Mapped/Conditional (Node 06): \`[K in keyof T]\` and \`T extends Promise<infer U> ? U : T\`.

To connect your live Ollama model, run \`ollama serve\` on your terminal and select your installed model in the Ollama tab!`;
    }

    return `🤖 [CyberDeck AI (Offline Mode)]: CyberDeck assistant active. (Note: Ollama server at \`${this.host}\` is currently offline or unreachable. Start Ollama with \`ollama serve\` to chat directly with your local LLMs!)`;
  }
}

window.ollamaClient = new OllamaClient();
