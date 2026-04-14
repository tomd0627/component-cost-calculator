/**
 * Encode and decode CalculatorInputs to/from URL search parameters.
 *
 * Short param keys keep URLs manageable when shared in Slack/email.
 * Invalid or out-of-range values are silently ignored — the hook that
 * calls decodeInputs merges the result with DEFAULT_INPUTS as a fallback.
 */

import type { CalculatorInputs, WcagLevel } from "@/types";

// ─── Key mapping ──────────────────────────────────────────────────────────────

const KEYS = {
  componentCount: "cc",
  hourlyRate:     "hr",
  browserCount:   "bc",
  wcagLevel:      "wl",
  qaHeadcount:    "qa",
  timelineWeeks:  "tw",
  teamSize:       "ts",
} as const satisfies Record<keyof CalculatorInputs, string>;

// ─── Validation helpers ───────────────────────────────────────────────────────

function clampInt(value: unknown, min: number, max: number): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return Math.round(n);
}

const WCAG_LEVELS: WcagLevel[] = ["A", "AA", "AAA"];

function parseWcagLevel(value: unknown): WcagLevel | undefined {
  if (typeof value === "string" && (WCAG_LEVELS as string[]).includes(value)) {
    return value as WcagLevel;
  }
  return undefined;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Serialise a full inputs object into URL search params. */
export function encodeInputs(inputs: CalculatorInputs): URLSearchParams {
  const params = new URLSearchParams();
  params.set(KEYS.componentCount, String(inputs.componentCount));
  params.set(KEYS.hourlyRate,     String(inputs.hourlyRate));
  params.set(KEYS.browserCount,   String(inputs.browserCount));
  params.set(KEYS.wcagLevel,      inputs.wcagLevel);
  params.set(KEYS.qaHeadcount,    String(inputs.qaHeadcount));
  params.set(KEYS.timelineWeeks,  String(inputs.timelineWeeks));
  params.set(KEYS.teamSize,       String(inputs.teamSize));
  return params;
}

/**
 * Parse URL search params back into a partial CalculatorInputs.
 * Fields that are missing or invalid are omitted — callers should
 * merge with DEFAULT_INPUTS: { ...DEFAULT_INPUTS, ...decodeInputs(params) }
 */
export function decodeInputs(params: URLSearchParams): Partial<CalculatorInputs> {
  const partial: Partial<CalculatorInputs> = {};

  const cc = clampInt(params.get(KEYS.componentCount), 1, 200);
  if (cc !== undefined) partial.componentCount = cc;

  const hr = clampInt(params.get(KEYS.hourlyRate), 50, 500);
  if (hr !== undefined) partial.hourlyRate = hr;

  const bc = clampInt(params.get(KEYS.browserCount), 1, 6);
  if (bc !== undefined) partial.browserCount = bc;

  const wl = parseWcagLevel(params.get(KEYS.wcagLevel));
  if (wl !== undefined) partial.wcagLevel = wl;

  const qa = clampInt(params.get(KEYS.qaHeadcount), 1, 10);
  if (qa !== undefined) partial.qaHeadcount = qa;

  const tw = clampInt(params.get(KEYS.timelineWeeks), 4, 52);
  if (tw !== undefined) partial.timelineWeeks = tw;

  const ts = clampInt(params.get(KEYS.teamSize), 1, 20);
  if (ts !== undefined) partial.teamSize = ts;

  return partial;
}

/** Returns true if params contains at least one recognised calculator key. */
export function hasCalculatorParams(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((k) => params.has(k));
}
