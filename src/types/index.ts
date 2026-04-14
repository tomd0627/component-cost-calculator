// ─── Input types ────────────────────────────────────────────────────────────

export type WcagLevel = "A" | "AA" | "AAA";

export interface CalculatorInputs {
  /** Number of UI components needed in the library. Range: 1–200. */
  componentCount: number;
  /** Fully-loaded hourly cost per developer (salary + benefits + overhead). Range: $50–$500/hr. */
  hourlyRate: number;
  /** Number of distinct browsers/devices the library must support. Range: 1–6. */
  browserCount: number;
  /** Target WCAG conformance level. Drives accessibility remediation cost estimates. */
  wcagLevel: WcagLevel;
  /** Number of QA engineers on the team. Affects QA hour calculations. Range: 1–10. */
  qaHeadcount: number;
  /** Available build timeline in weeks. Range: 4–52. */
  timelineWeeks: number;
  /** Number of developers on the team. Affects license cost (commercial path). Range: 1–20. */
  teamSize: number;
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  componentCount: 20,
  hourlyRate: 125,
  browserCount: 3,
  wcagLevel: "AA",
  qaHeadcount: 2,
  timelineWeeks: 16,
  teamSize: 5,
};

// ─── Result types ─────────────────────────────────────────────────────────────

export type PathId = "scratch" | "opensource" | "commercial";

export type RiskLevel = "low" | "medium" | "high";

export type RecommendationTag =
  | "recommended"
  | "best-value"
  | "high-risk"
  | "high-cost"
  | "enterprise-fit";

export interface PathCostBreakdown {
  pathId: PathId;
  /** Display name shown in the UI card header. */
  label: string;
  /** One-line descriptor shown beneath the label. */
  tagline: string;
  /** Example libraries for this path. */
  examples: string;
  /** Core development hours (design + implementation + unit tests). */
  devHours: number;
  /** QA hours (exploratory testing, regression, component spec tests). */
  qaHours: number;
  /**
   * Hours to remediate accessibility issues to reach target WCAG level.
   * Based on Deque Systems research: remediation during dev costs 6x vs. design;
   * post-launch costs 30x. This models the dev-time fraction.
   */
  a11yRemediationHours: number;
  /** Cross-browser/device testing hours beyond the first target. */
  crossBrowserHours: number;
  /**
   * Hours to integrate, theme, and configure the library.
   * Non-zero only for the commercial path (vendor-specific APIs, theming systems).
   */
  integrationHours: number;
  /** Sum of all hour categories above. */
  totalBuildHours: number;
  /** totalBuildHours × hourlyRate */
  totalBuildCost: number;
  /** Ongoing cost in year 1 to maintain, upgrade, and adapt components. */
  annualMaintenanceCost: number;
  /**
   * Per-developer annual license fee × teamSize.
   * Zero for scratch and open-source paths.
   */
  licenseCost: number;
  /** totalBuildCost + annualMaintenanceCost + licenseCost */
  firstYearTotalCost: number;
  risk: RiskLevel;
  recommendation: RecommendationTag;
  /** Human-readable citation note shown in the a11y tooltip. */
  a11ySourceNote: string;
}

export interface CalculatorResults {
  inputs: CalculatorInputs;
  /** Always ordered: [scratch, opensource, commercial] */
  paths: [PathCostBreakdown, PathCostBreakdown, PathCostBreakdown];
  cheapestPathId: PathId;
  fastestPathId: PathId;
  /** ISO 8601 timestamp of when results were computed. */
  generatedAt: string;
}
