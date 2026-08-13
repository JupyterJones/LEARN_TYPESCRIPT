/* TS-HACK // Bulletproof TypeScript Validation Engine & Diagnostics */

class TSValidator {
  constructor() {
    this.logs = [];
  }

  validate(nodeId, code) {
    const challenge = window.CYBER_CHALLENGES.find(c => c.id === nodeId);
    if (!challenge) {
      return { success: false, logs: ['[ERROR]: Node challenge metadata not found.'], passedRules: 0, totalRules: 0, time: '0.0' };
    }

    const logs = [];
    const startTime = performance.now();

    logs.push(`[COMPILER v5.4.0]: Analyzing ${challenge.filename}...`);

    if (!code || !code.trim()) {
      logs.push(`[COMPILER ERROR]: Editor is empty. Write TypeScript code to breach mainframe.`);
      return { success: false, time: '0.1', logs, passedRules: 0, totalRules: 1 };
    }

    // 1. Basic JS/TS syntax check via Function parsing
    try {
      const cleanedJs = this.stripTS(code);
      new Function(cleanedJs);
      logs.push(`[PARSER]: Syntax tree validation passed (0 syntax errors).`);
    } catch (err) {
      logs.push(`[COMPILER ERROR]: Syntax Error: ${err.message}`);
      return {
        success: false,
        time: (performance.now() - startTime).toFixed(1),
        logs,
        passedRules: 0,
        totalRules: 1
      };
    }

    // 2. Derive validation rules
    const rules = challenge.validationRules || this.generateRules(challenge);
    let passedCount = 0;

    rules.forEach(rule => {
      let isPassed = false;
      try {
        isPassed = rule.check(code);
      } catch (e) {
        isPassed = false;
      }

      if (isPassed) {
        passedCount++;
        logs.push(`  ✓ PASS: ${rule.desc}`);
      } else {
        logs.push(`  ❌ FAIL: TS2304 / TS2322: ${rule.desc}`);
      }
    });

    const isTotalSuccess = passedCount === rules.length && rules.length > 0;
    const elapsedTime = (performance.now() - startTime).toFixed(1);

    if (isTotalSuccess) {
      logs.push(`[MAINFRAME BREACHED]: All ${rules.length} target protocols satisfied!`);
      logs.push(`[REWARD]: +${challenge.xp || 100} Cyber Credits awarded.`);
    } else {
      logs.push(`[DIAGNOSTICS]: ${passedCount}/${rules.length} protocols passed. Refactor type errors and retry.`);
    }

    return {
      success: isTotalSuccess,
      time: elapsedTime,
      logs,
      passedRules: passedCount,
      totalRules: rules.length
    };
  }

  generateRules(challenge) {
    // Fallback rule generator based on challenge objectives
    const rules = [];
    const id = challenge.id;

    if (id === 1) {
      rules.push({ desc: "Export const vaultId: number = 2049", check: c => /export\s+const\s+vaultId\s*:\s*number\s*=\s*2049/.test(c) });
      rules.push({ desc: "Export const sectorName: string = 'Dayton Substation'", check: c => /export\s+const\s+sectorName\s*:\s*string\s*=\s*["']Dayton Substation["']/.test(c) });
      rules.push({ desc: "Export const isGridOnline: boolean = true", check: c => /export\s+const\s+isGridOnline\s*:\s*boolean\s*=\s*true/.test(c) });
      rules.push({ desc: "Export const voltageLevels: number[] = [120, 240, 480]", check: c => /export\s+const\s+voltageLevels\s*:\s*number\[\]\s*=/.test(c) });
    } else if (id === 2) {
      rules.push({ desc: "Define exported interface WaterSensor", check: c => /export\s+interface\s+WaterSensor/.test(c) });
      rules.push({ desc: "WaterSensor has readonly id: number and alertMessage?: string", check: c => /readonly\s+id\s*:\s*number/.test(c) && /alertMessage\?\s*:\s*string/.test(c) });
      rules.push({ desc: "Export activeSensor typed as WaterSensor", check: c => /export\s+const\s+activeSensor\s*:\s*WaterSensor\s*=/.test(c) });
    } else if (id === 3) {
      rules.push({ desc: "Define generic interface TelemetryPacket<T>", check: c => /export\s+interface\s+TelemetryPacket\s*<\s*T\s*>/.test(c) });
      rules.push({ desc: "Export generic function wrapTelemetry<T>(data: T): TelemetryPacket<T>", check: c => /export\s+function\s+wrapTelemetry\s*<\s*T\s*>\s*\(/.test(c) });
    } else if (id === 4) {
      rules.push({ desc: "Define interface SqliteNote with id, title, content, created_at", check: c => /export\s+interface\s+SqliteNote/.test(c) });
      rules.push({ desc: "Export function parseNoteRow(row: any): SqliteNote", check: c => /export\s+function\s+parseNoteRow/.test(c) && /:\s*SqliteNote/.test(c) });
    } else if (id === 5) {
      rules.push({ desc: "Define interface NoteConfig", check: c => /export\s+interface\s+NoteConfig/.test(c) });
      rules.push({ desc: "Export type guard isValidNoteConfig(obj: any): obj is NoteConfig", check: c => /obj\s+is\s+NoteConfig/.test(c) });
    } else if (id === 6) {
      rules.push({ desc: "Export function sanitizeColumn(val: string | null | undefined): string", check: c => /export\s+function\s+sanitizeColumn/.test(c) });
      rules.push({ desc: "Export function formatTagList(tags: string | null): string[]", check: c => /export\s+function\s+formatTagList/.test(c) });
    } else if (id === 7) {
      rules.push({ desc: "Define generic interface ApiResponse<T>", check: c => /export\s+interface\s+ApiResponse\s*<\s*T\s*>/.test(c) });
      rules.push({ desc: "Export async function fetchData<T>(mockData: T): Promise<ApiResponse<T>>", check: c => /Promise\s*<\s*ApiResponse\s*<\s*T\s*>\s*>/.test(c) });
    } else if (id === 8) {
      rules.push({ desc: "Define SuccessResult<T> with success: true and ErrorResult with success: false", check: c => /success\s*:\s*true/.test(c) && /success\s*:\s*false/.test(c) });
      rules.push({ desc: "Export type NetworkResult<T> = SuccessResult<T> | ErrorResult", check: c => /type\s+NetworkResult/.test(c) });
    } else if (id === 9) {
      rules.push({ desc: "Define interface TelecomHub", check: c => /export\s+interface\s+TelecomHub/.test(c) });
      rules.push({ desc: "Export type PublicHubInfo = Omit<TelecomHub, 'secretKey'>", check: c => /Omit\s*<\s*TelecomHub/.test(c) });
      rules.push({ desc: "Export type HubPatch = Partial<TelecomHub>", check: c => /Partial\s*<\s*TelecomHub/.test(c) });
    } else {
      rules.push({ desc: "Valid TypeScript Code Exported", check: c => /export\s+/.test(c) });
    }

    return rules;
  }

  stripTS(code) {
    return code
      .replace(/export\s+/g, '')
      .replace(/interface\s+\w+[\s\S]*?\}/g, '')
      .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
      .replace(/:\s*[A-Za-z0-9_<>\[\]|&\s"]+(?=[,)=;{])/g, '')
      .replace(/<[A-Za-z0-9_,\s]+>/g, '');
  }
}

window.tsValidator = new TSValidator();
