/* TS-HACK // Cyberpunk TypeScript Challenge Suite & 3-Tier Curriculum */

window.CYBER_CHALLENGES = [
  // ==========================================
  // LEVEL 1: MAINFRAME SECURITY CORE (FUNDAMENTALS)
  // ==========================================
  {
    id: 1,
    level: 1,
    xp: 100,
    levelTitle: "LEVEL 1: MAINFRAME SECURITY CORE",
    tag: "NODE 01 // DAYLAN ELECTRIC MAYLAR",
    title: "Primitive Types & Power Grid Vault",
    difficulty: "EASY",
    filename: "daylan_power.ts",
    lore: "Daylan Electric Maylar's sub-station in Dayton, Ohio is running un-typed legacy JavaScript. Unchecked string variables are overloading the power transformers! Fix the un-typed variable declarations with explicit TypeScript types.",
    concept: "<strong>TypeScript Primitives:</strong> Explicitly annotate variable declarations using <code>number</code>, <code>string</code>, <code>boolean</code>, and array types <code>number[]</code>.",
    objectives: [
      "Export constant `vaultId` typed as `number` set to `2049`",
      "Export constant `sectorName` typed as `string` set to `'Dayton Substation'`",
      "Export constant `isGridOnline` typed as `boolean` set to `true`",
      "Export constant `voltageLevels` typed as `number[]` set to `[120, 240, 480]`"
    ],
    starterCode: `// DAYLAN ELECTRIC MAYLAR — UN-TYPED LEGACY CODE
// Fix variable declarations with explicit TypeScript types!

export const vaultId = "2049"; // ERROR: string assigned instead of number!
export const sectorName = 101;  // ERROR: number assigned instead of string!
export const isGridOnline = "true"; // ERROR: string instead of boolean!
export const voltageLevels = ["120", "240", "480"]; // ERROR: string[] instead of number[]!
`,
    validationRules: [
      { desc: "Export constant vaultId typed as number set to 2049", check: c => /export\s+const\s+vaultId\s*:\s*number\s*=\s*2049/.test(c) },
      { desc: "Export constant sectorName typed as string set to 'Dayton Substation'", check: c => /export\s+const\s+sectorName\s*:\s*string\s*=\s*["']Dayton Substation["']/.test(c) },
      { desc: "Export constant isGridOnline typed as boolean set to true", check: c => /export\s+const\s+isGridOnline\s*:\s*boolean\s*=\s*true/.test(c) },
      { desc: "Export constant voltageLevels typed as number[] set to [120, 240, 480]", check: c => /export\s+const\s+voltageLevels\s*:\s*number\[\]\s*=/.test(c) }
    ]
  },

  {
    id: 2,
    level: 1,
    xp: 150,
    levelTitle: "LEVEL 1: MAINFRAME SECURITY CORE",
    tag: "NODE 02 // MARCHEL WATER WORKS",
    title: "Interfaces & Optional Water Sensors",
    difficulty: "EASY",
    filename: "marchel_water.ts",
    lore: "Marchel Water's treatment facility (operating across Dayton, OH & Colorado) needs strict data contracts. Unchecked sensor objects are causing pressure valve leaks! Define an exported interface `WaterSensor` with optional property modifiers.",
    concept: "<strong>Interfaces & Modifiers:</strong> Use <code>interface</code> to define object shapes. Mark optional properties with <code>?</code> and immutable fields with <code>readonly</code>.",
    objectives: [
      "Define exported interface `WaterSensor` with `readonly id: number`, `location: string`, `psi: number`, and optional `alertMessage?: string`",
      "Export `activeSensor` typed as `WaterSensor`"
    ],
    starterCode: `// MARCHEL WATER WORKS — UN-TYPED SENSOR DATA
// Define the WaterSensor interface and export activeSensor!

export interface WaterSensor {
  // TODO: Add readonly id: number, location: string, psi: number, alertMessage?: string
}

export const activeSensor = {
  id: 108,
  location: "Dayton Reservoir Vault A",
  psi: 14.7
};
`,
    validationRules: [
      { desc: "Define exported interface WaterSensor", check: c => /export\s+interface\s+WaterSensor/.test(c) },
      { desc: "WaterSensor has readonly id: number and alertMessage?: string", check: c => /readonly\s+id\s*:\s*number/.test(c) && /alertMessage\?\s*:\s*string/.test(c) },
      { desc: "Export activeSensor typed as WaterSensor", check: c => /export\s+const\s+activeSensor\s*:\s*WaterSensor\s*=/.test(c) }
    ]
  },

  {
    id: 3,
    level: 1,
    xp: 200,
    levelTitle: "LEVEL 1: MAINFRAME SECURITY CORE",
    tag: "NODE 03 // MARKETAL UTILITIES",
    title: "Generics <T> & Telemetry Wrappers",
    difficulty: "MEDIUM",
    filename: "marketal_telemetry.ts",
    lore: "Marketal Utilities routes millions of raw telemetry packets. Hardcoded `any` types are allowing corrupt packets to pass through! Build a reusable generic interface `TelemetryPacket<T>` to wrap generic data payloads safely.",
    concept: "<strong>TypeScript Generics:</strong> Reusable type signatures using <code>&lt;T&gt;</code> placeholders to preserve exact payload type information across functions and objects.",
    objectives: [
      "Define generic interface `TelemetryPacket<T>` with `timestamp: string` and `payload: T`",
      "Export function `wrapTelemetry<T>(data: T): TelemetryPacket<T>`"
    ],
    starterCode: `// MARKETAL UTILITIES — UN-TYPED PACKET ROUTER
// Implement generic TelemetryPacket<T> and wrapTelemetry<T>()!

export interface TelemetryPacket<T> {
  // TODO: Add timestamp: string and payload: T
}

export function wrapTelemetry(data: any): any {
  // TODO: Refactor function signature to use generic <T>
  return {
    timestamp: "2026-08-13T08:00:00Z",
    payload: data
  };
}
`,
    validationRules: [
      { desc: "Define generic interface TelemetryPacket<T>", check: c => /export\s+interface\s+TelemetryPacket\s*<\s*T\s*>/.test(c) },
      { desc: "Export generic function wrapTelemetry<T>(data: T): TelemetryPacket<T>", check: c => /export\s+function\s+wrapTelemetry\s*<\s*T\s*>\s*\(/.test(c) }
    ]
  },

  // ==========================================
  // LEVEL 2: DATABASE & DATA VAULT HACKING (INTERMEDIATE)
  // ==========================================
  {
    id: 4,
    level: 2,
    xp: 250,
    levelTitle: "LEVEL 2: DATABASE & DATA VAULT HACKING",
    tag: "NODE 04 // SQLITE3 DATABASE MAPPER",
    title: "Typing SQLite3 Database Query Rows",
    difficulty: "MEDIUM",
    filename: "sqlite_mapper.ts",
    lore: "You've tapped into the backend SQLite3 database (`notes.db`). Raw database driver calls return un-typed SQL rows. Create an interface `SqliteNote` and a type-safe mapper function to convert raw database rows into typed objects.",
    concept: "<strong>SQLite Row Typing:</strong> Mapping database columns (e.g. <code>id</code>, <code>title</code>, <code>content</code>, <code>tags</code>) to strongly typed TypeScript interfaces.",
    objectives: [
      "Define interface `SqliteNote` with `id: number`, `title: string`, `content: string`, `tags?: string`, and `created_at: string`",
      "Export function `parseNoteRow(row: any): SqliteNote`"
    ],
    starterCode: `// SQLITE3 DATABASE MAPPER — NOTES.DB INTERCEPT
// Define SqliteNote interface and write parseNoteRow mapper!

export interface SqliteNote {
  // TODO: Add id: number, title: string, content: string, tags?: string, created_at: string
}

export function parseNoteRow(row: any): any {
  // TODO: Annotate return type as SqliteNote
  return {
    id: row.id,
    title: row.title || "Untitled",
    content: row.content || "",
    tags: row.tags,
    created_at: row.created_at || new Date().toISOString()
  };
}
`,
    validationRules: [
      { desc: "Define interface SqliteNote with id, title, content, created_at", check: c => /export\s+interface\s+SqliteNote/.test(c) },
      { desc: "Export function parseNoteRow(row: any): SqliteNote", check: c => /export\s+function\s+parseNoteRow/.test(c) && /:\s*SqliteNote/.test(c) }
    ]
  },

  {
    id: 5,
    level: 2,
    xp: 300,
    levelTitle: "LEVEL 2: DATABASE & DATA VAULT HACKING",
    tag: "NODE 05 // JSON SCHEMA PARSER",
    title: "Parsing & Validating JSON File Objects",
    difficulty: "MEDIUM",
    filename: "json_validator.ts",
    lore: "CyberDeck logs are exported as JSON data files. `JSON.parse()` returns `any`, bypassing TypeScript safety! Implement a type guard function `isValidNoteConfig()` that validates parsed JSON objects.",
    concept: "<strong>Type Guards & JSON Schemas:</strong> Use custom predicate type guards <code>val is TargetType</code> to safely validate untyped JSON data objects.",
    objectives: [
      "Define interface `NoteConfig` with `theme: string` and `autoSave: boolean`",
      "Export type guard function `isValidNoteConfig(obj: any): obj is NoteConfig`"
    ],
    starterCode: `// JSON SCHEMA VALIDATOR
// Implement type predicate isValidNoteConfig(obj: any): obj is NoteConfig!

export interface NoteConfig {
  // TODO: Add theme: string and autoSave: boolean
}

export function isValidNoteConfig(obj: any): boolean {
  // TODO: Change return type annotation to obj is NoteConfig
  return typeof obj === "object" && obj !== null && typeof obj.theme === "string" && typeof obj.autoSave === "boolean";
}
`,
    validationRules: [
      { desc: "Define interface NoteConfig with theme: string and autoSave: boolean", check: c => /export\s+interface\s+NoteConfig/.test(c) },
      { desc: "Export type guard isValidNoteConfig(obj: any): obj is NoteConfig", check: c => /obj\s+is\s+NoteConfig/.test(c) }
    ]
  },

  {
    id: 6,
    level: 2,
    xp: 350,
    levelTitle: "LEVEL 2: DATABASE & DATA VAULT HACKING",
    tag: "NODE 06 // SQL NULL VS UNDEFINED",
    title: "Handling Strict Nulls & Database Defaults",
    difficulty: "HARD",
    filename: "strict_nulls.ts",
    lore: "SQLite database columns can store `NULL` values when fields are empty. TypeScript strict null checks require distinguishing between `string | null` and `undefined`. Fix the database column formatter to sanitize NULL rows.",
    concept: "<strong>Strict Null Checks:</strong> Explicitly handling <code>null</code> vs <code>undefined</code> union types using nullish coalescing <code>??</code> and narrowing.",
    objectives: [
      "Export function `sanitizeColumn(val: string | null | undefined): string` returning `'N/A'` if `null` or `undefined`",
      "Export function `formatTagList(tags: string | null): string[]` returning empty array `[]` if `null`"
    ],
    starterCode: `// STRICT NULL HANDLING — SQLITE COLUMN SANITIZER
// Implement sanitizeColumn and formatTagList with strict types!

export function sanitizeColumn(val: any): any {
  // TODO: Annotate parameter as val: string | null | undefined and return string
  return val ?? "N/A";
}

export function formatTagList(tags: any): any {
  // TODO: Annotate parameter as tags: string | null and return string[]
  if (!tags) return [];
  return tags.split(",").map(t => t.trim());
}
`,
    validationRules: [
      { desc: "Export function sanitizeColumn(val: string | null | undefined): string", check: c => /export\s+function\s+sanitizeColumn/.test(c) },
      { desc: "Export function formatTagList(tags: string | null): string[]", check: c => /export\s+function\s+formatTagList/.test(c) }
    ]
  },

  // ==========================================
  // LEVEL 3: ADVANCED ASYNC APIS & NETWORK INTERCEPTS (ADVANCED)
  // ==========================================
  {
    id: 7,
    level: 3,
    xp: 400,
    levelTitle: "LEVEL 3: ADVANCED ASYNC APIS & NETWORK INTERCEPTS",
    tag: "NODE 07 // ASYNC REST PROMISES",
    title: "Typing Asynchronous REST API Responses",
    difficulty: "HARD",
    filename: "async_api.ts",
    lore: "The CyberDeck intercepts REST API responses from `/api/notes`. Asynchronous network operations return `Promise<T>`. Define generic API response wrappers and typed async fetch functions.",
    concept: "<strong>Async Promises & API Types:</strong> Typing asynchronous operations with <code>Promise&lt;T&gt;</code> and <code>async/await</code> syntax.",
    objectives: [
      "Define generic interface `ApiResponse<T>` with `status: number` and `data: T`",
      "Export async function `fetchData<T>(mockData: T): Promise<ApiResponse<T>>`"
    ],
    starterCode: `// ASYNC REST PROMISES — NETWORK INTERCEPT
// Implement ApiResponse<T> and async fetchData<T>()!

export interface ApiResponse<T> {
  // TODO: Add status: number and data: T
}

export async function fetchData(mockData: any): Promise<any> {
  // TODO: Annotate function as generic fetchData<T>(mockData: T): Promise<ApiResponse<T>>
  return {
    status: 200,
    data: mockData
  };
}
`,
    validationRules: [
      { desc: "Define generic interface ApiResponse<T>", check: c => /export\s+interface\s+ApiResponse\s*<\s*T\s*>/.test(c) },
      { desc: "Export async function fetchData<T>(mockData: T): Promise<ApiResponse<T>>", check: c => /Promise\s*<\s*ApiResponse\s*<\s*T\s*>\s*>/.test(c) }
    ]
  },

  {
    id: 8,
    level: 3,
    xp: 450,
    levelTitle: "LEVEL 3: ADVANCED ASYNC APIS & NETWORK INTERCEPTS",
    tag: "NODE 08 // DISCRIMINATED UNIONS",
    title: "Type-Safe Network Result Discriminators",
    difficulty: "HARD",
    filename: "discriminated_unions.ts",
    lore: "Network requests can either succeed with data or fail with error details. Use Discriminated Unions with a literal tag property `success: true | false` to force safe error handling before data access.",
    concept: "<strong>Discriminated Unions:</strong> Combining union types with a common literal discriminator field (e.g. <code>success: true</code> vs <code>success: false</code>).",
    objectives: [
      "Define `SuccessResult<T>` with `success: true` and `data: T`",
      "Define `ErrorResult` with `success: false` and `error: string`",
      "Export type `NetworkResult<T> = SuccessResult<T> | ErrorResult`"
    ],
    starterCode: `// DISCRIMINATED UNIONS — NETWORK RESULT TYPE
// Define SuccessResult<T>, ErrorResult, and NetworkResult<T>!

export interface SuccessResult<T> {
  // TODO: Add success: true and data: T
}

export interface ErrorResult {
  // TODO: Add success: false and error: string
}

export type NetworkResult<T> = any; // TODO: SuccessResult<T> | ErrorResult

export function handleResult<T>(res: NetworkResult<T>): string {
  if (res.success) {
    return "SUCCESS";
  } else {
    return res.error;
  }
}
`,
    validationRules: [
      { desc: "Define SuccessResult<T> with success: true and ErrorResult with success: false", check: c => /success\s*:\s*true/.test(c) && /success\s*:\s*false/.test(c) },
      { desc: "Export type NetworkResult<T> = SuccessResult<T> | ErrorResult", check: c => /type\s+NetworkResult/.test(c) }
    ]
  },

  {
    id: 9,
    level: 3,
    xp: 500,
    levelTitle: "LEVEL 3: ADVANCED ASYNC APIS & NETWORK INTERCEPTS",
    tag: "NODE 09 // MANILA TELECOM HUB",
    title: "Utility Types: Pick, Omit & Partial",
    difficulty: "EXPERT",
    filename: "manila_telecom.ts",
    lore: "The final mainframe in Manila Philippines requires partial updates and object projection. Refactor legacy data transformers using TypeScript utility types (`Pick`, `Omit`, and `Partial`).",
    concept: "<strong>TypeScript Utility Types:</strong> Constructing derived types using <code>Pick&lt;T, K&gt;</code>, <code>Omit&lt;T, K&gt;</code>, and <code>Partial&lt;T&gt;</code>.",
    objectives: [
      "Define interface `TelecomHub` with `id: number`, `city: string`, `bandwidthGbps: number`, and `secretKey: string`",
      "Export type `PublicHubInfo = Omit<TelecomHub, 'secretKey'>`",
      "Export type `HubPatch = Partial<TelecomHub>`"
    ],
    starterCode: `// MANILA TELECOM HUB — UTILITY TYPES OMIT & PARTIAL
// Create TelecomHub interface, PublicHubInfo type, and HubPatch type!

export interface TelecomHub {
  id: number;
  city: string;
  bandwidthGbps: number;
  secretKey: string;
}

export type PublicHubInfo = any; // TODO: Omit<TelecomHub, "secretKey">
export type HubPatch = any;       // TODO: Partial<TelecomHub>

export const sampleHub: PublicHubInfo = {
  id: 707,
  city: "Manila",
  bandwidthGbps: 10000
};
`,
    validationRules: [
      { desc: "Define interface TelecomHub with id, city, bandwidthGbps, secretKey", check: c => /export\s+interface\s+TelecomHub/.test(c) },
      { desc: "Export type PublicHubInfo = Omit<TelecomHub, 'secretKey'>", check: c => /Omit\s*<\s*TelecomHub/.test(c) },
      { desc: "Export type HubPatch = Partial<TelecomHub>", check: c => /Partial\s*<\s*TelecomHub/.test(c) }
    ]
  }
];
