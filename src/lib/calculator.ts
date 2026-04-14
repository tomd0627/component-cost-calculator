/**
 * Pure calculation functions for the Component Cost Calculator.
 *
 * All functions here are side-effect free: same inputs always produce the same
 * outputs, no DOM access, no global state, no async. This makes them trivially
 * testable and safe to call on every input change.
 */

import type {
  CalculatorInputs,
  CalculatorResults,
  PathCostBreakdown,
  PathId,
  RecommendationTag,
  RiskLevel,
} from "@/types";

import {
  A11Y_REMEDIATION_FRACTION_COMMERCIAL,
  A11Y_REMEDIATION_FRACTION_OPENSOURCE,
  A11Y_REMEDIATION_FRACTION_SCRATCH,
  A11Y_SOURCE_NOTE,
  ANNUAL_MAINTENANCE_FRACTION_COMMERCIAL,
  ANNUAL_MAINTENANCE_FRACTION_OPENSOURCE,
  ANNUAL_MAINTENANCE_FRACTION_SCRATCH,
  COMMERCIAL_CROSS_BROWSER_REDUCTION,
  COMMERCIAL_DEV_MULTIPLIER,
  COMMERCIAL_ENTERPRISE_TEAM_THRESHOLD,
  COMMERCIAL_INTEGRATION_HOURS_PER_COMPONENT,
  COMMERCIAL_LICENSE_COST_PER_DEV_PER_YEAR,
  CROSS_BROWSER_HOURS_PER_EXTRA_TARGET,
  HOURS_PER_COMPONENT_SCRATCH,
  OPENSOURCE_CROSS_BROWSER_REDUCTION,
  OPENSOURCE_DEV_MULTIPLIER,
  QA_HOURS_PER_DEV_HOUR,
  SCRATCH_HIGH_RISK_COMPONENT_THRESHOLD,
} from "./constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * The base cross-browser testing hours before any path-specific reduction.
 * Only the hours for browsers BEYOND the first are counted — the first browser
 * is already covered by normal QA.
 */
function baseCrossBrowserHours(inputs: CalculatorInputs): number {
  const extraBrowsers = Math.max(0, inputs.browserCount - 1);
  return inputs.componentCount * extraBrowsers * CROSS_BROWSER_HOURS_PER_EXTRA_TARGET;
}

/**
 * The notional scratch dev hours used as the basis for a11y remediation costs.
 * We always apply remediation fractions to the FULL scratch estimate, not the
 * reduced hours — because a11y complexity is a function of what the component
 * does, not how you sourced it.
 */
function fullScratchDevHours(inputs: CalculatorInputs): number {
  return inputs.componentCount * HOURS_PER_COMPONENT_SCRATCH;
}

// ─── Path calculators ─────────────────────────────────────────────────────────

function calcScratch(inputs: CalculatorInputs): PathCostBreakdown {
  const { componentCount, hourlyRate, wcagLevel, qaHeadcount, teamSize } = inputs;

  const devHours = componentCount * HOURS_PER_COMPONENT_SCRATCH;
  const a11yRemediationHours = fullScratchDevHours(inputs) * A11Y_REMEDIATION_FRACTION_SCRATCH[wcagLevel];
  const crossBrowserHours = baseCrossBrowserHours(inputs);
  const integrationHours = 0;

  const totalDevHours = devHours + a11yRemediationHours + crossBrowserHours;
  // QA scales with dev hours but is bounded by the QA-to-dev ratio and headcount proportion.
  const qaHours = totalDevHours * QA_HOURS_PER_DEV_HOUR * (qaHeadcount / teamSize);
  const totalBuildHours = totalDevHours + qaHours;
  const totalBuildCost = totalBuildHours * hourlyRate;
  const annualMaintenanceCost = totalBuildCost * ANNUAL_MAINTENANCE_FRACTION_SCRATCH;
  const licenseCost = 0;
  const firstYearTotalCost = totalBuildCost + annualMaintenanceCost + licenseCost;

  const risk: RiskLevel =
    componentCount >= SCRATCH_HIGH_RISK_COMPONENT_THRESHOLD ? "high" : "medium";

  const recommendation: RecommendationTag =
    componentCount >= SCRATCH_HIGH_RISK_COMPONENT_THRESHOLD ? "high-risk" : "high-cost";

  return {
    pathId: "scratch",
    label: "Build from Scratch",
    tagline: "Full ownership, maximum flexibility",
    examples: "Custom React components, internal design system",
    devHours,
    qaHours,
    a11yRemediationHours,
    crossBrowserHours,
    integrationHours,
    totalBuildHours,
    totalBuildCost,
    annualMaintenanceCost,
    licenseCost,
    firstYearTotalCost,
    risk,
    recommendation,
    a11ySourceNote: A11Y_SOURCE_NOTE,
  };
}

function calcOpensource(inputs: CalculatorInputs): PathCostBreakdown {
  const { componentCount, hourlyRate, wcagLevel, qaHeadcount, teamSize } = inputs;

  const devHours = componentCount * HOURS_PER_COMPONENT_SCRATCH * OPENSOURCE_DEV_MULTIPLIER;
  // A11y remediation is based on full scratch hours — see fullScratchDevHours comment.
  const a11yRemediationHours =
    fullScratchDevHours(inputs) * A11Y_REMEDIATION_FRACTION_OPENSOURCE[wcagLevel];
  const crossBrowserHours = baseCrossBrowserHours(inputs) * OPENSOURCE_CROSS_BROWSER_REDUCTION;
  const integrationHours = 0;

  const totalDevHours = devHours + a11yRemediationHours + crossBrowserHours;
  const qaHours = totalDevHours * QA_HOURS_PER_DEV_HOUR * (qaHeadcount / teamSize);
  const totalBuildHours = totalDevHours + qaHours;
  const totalBuildCost = totalBuildHours * hourlyRate;
  const annualMaintenanceCost = totalBuildCost * ANNUAL_MAINTENANCE_FRACTION_OPENSOURCE;
  const licenseCost = 0;
  const firstYearTotalCost = totalBuildCost + annualMaintenanceCost + licenseCost;

  const risk: RiskLevel = "low";
  // Recommendation is assigned after comparing all paths in calculateResults.
  const recommendation: RecommendationTag = "best-value";

  return {
    pathId: "opensource",
    label: "Open-Source Library",
    tagline: "Radix UI primitives, shadcn/ui",
    examples: "Radix UI, shadcn/ui, Headless UI, Ariakit",
    devHours,
    qaHours,
    a11yRemediationHours,
    crossBrowserHours,
    integrationHours,
    totalBuildHours,
    totalBuildCost,
    annualMaintenanceCost,
    licenseCost,
    firstYearTotalCost,
    risk,
    recommendation,
    a11ySourceNote: A11Y_SOURCE_NOTE,
  };
}

function calcCommercial(inputs: CalculatorInputs): PathCostBreakdown {
  const { componentCount, hourlyRate, wcagLevel, qaHeadcount, teamSize } = inputs;

  const devHours = componentCount * HOURS_PER_COMPONENT_SCRATCH * COMMERCIAL_DEV_MULTIPLIER;
  const integrationHours = componentCount * COMMERCIAL_INTEGRATION_HOURS_PER_COMPONENT;
  const a11yRemediationHours =
    fullScratchDevHours(inputs) * A11Y_REMEDIATION_FRACTION_COMMERCIAL[wcagLevel];
  const crossBrowserHours = baseCrossBrowserHours(inputs) * COMMERCIAL_CROSS_BROWSER_REDUCTION;

  const totalDevHours = devHours + integrationHours + a11yRemediationHours + crossBrowserHours;
  const qaHours = totalDevHours * QA_HOURS_PER_DEV_HOUR * (qaHeadcount / teamSize);
  const totalBuildHours = totalDevHours + qaHours;
  const totalBuildCost = totalBuildHours * hourlyRate;
  const annualMaintenanceCost = totalBuildCost * ANNUAL_MAINTENANCE_FRACTION_COMMERCIAL;
  const licenseCost = teamSize * COMMERCIAL_LICENSE_COST_PER_DEV_PER_YEAR;
  const firstYearTotalCost = totalBuildCost + annualMaintenanceCost + licenseCost;

  const risk: RiskLevel = teamSize >= COMMERCIAL_ENTERPRISE_TEAM_THRESHOLD ? "low" : "medium";

  const recommendation: RecommendationTag =
    teamSize >= COMMERCIAL_ENTERPRISE_TEAM_THRESHOLD ? "enterprise-fit" : "high-cost";

  return {
    pathId: "commercial",
    label: "Commercial Library",
    tagline: "Licensed components with vendor support",
    examples: "MUI Pro, Telerik Kendo UI, Syncfusion",
    devHours,
    qaHours,
    a11yRemediationHours,
    crossBrowserHours,
    integrationHours,
    totalBuildHours,
    totalBuildCost,
    annualMaintenanceCost,
    licenseCost,
    firstYearTotalCost,
    risk,
    recommendation,
    a11ySourceNote: A11Y_SOURCE_NOTE,
  };
}

// ─── Recommendation finalization ──────────────────────────────────────────────

/**
 * After all three paths are computed, assign the final recommendation tags.
 * The open-source path is always at least "best-value"; if it's also the
 * cheapest path overall, it becomes "recommended".
 */
function finalizeRecommendations(
  scratch: PathCostBreakdown,
  opensource: PathCostBreakdown,
  commercial: PathCostBreakdown,
): [PathCostBreakdown, PathCostBreakdown, PathCostBreakdown] {
  const cheapestId = [scratch, opensource, commercial].reduce((a, b) =>
    a.firstYearTotalCost <= b.firstYearTotalCost ? a : b,
  ).pathId;

  const finalOpensource: PathCostBreakdown = {
    ...opensource,
    recommendation: cheapestId === "opensource" ? "recommended" : "best-value",
  };

  return [scratch, finalOpensource, commercial];
}

// ─── Fastest path ─────────────────────────────────────────────────────────────

function fastestPathId(
  scratch: PathCostBreakdown,
  opensource: PathCostBreakdown,
  commercial: PathCostBreakdown,
): PathId {
  return [scratch, opensource, commercial].reduce((a, b) =>
    a.totalBuildHours <= b.totalBuildHours ? a : b,
  ).pathId;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * The single entry point for all cost calculations.
 *
 * Accepts a complete set of user inputs and returns a fully populated
 * CalculatorResults object. Safe to call on every keystroke — no side effects.
 */
export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const scratch = calcScratch(inputs);
  const opensource = calcOpensource(inputs);
  const commercial = calcCommercial(inputs);

  const [finalScratch, finalOpensource, finalCommercial] = finalizeRecommendations(
    scratch,
    opensource,
    commercial,
  );

  const cheapestId = [finalScratch, finalOpensource, finalCommercial].reduce((a, b) =>
    a.firstYearTotalCost <= b.firstYearTotalCost ? a : b,
  ).pathId;

  return {
    inputs,
    paths: [finalScratch, finalOpensource, finalCommercial],
    cheapestPathId: cheapestId,
    fastestPathId: fastestPathId(finalScratch, finalOpensource, finalCommercial),
    generatedAt: new Date().toISOString(),
  };
}
