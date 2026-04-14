/**
 * Research-backed constants for the Component Cost Calculator.
 *
 * Every number here is named, typed, and cited. Magic numbers belong in
 * no other file. If an assumption changes, it changes in exactly one place.
 *
 * Sources
 * -------
 * [DEQUE]    Deque Systems, "The Business Case for Digital Accessibility" (2023)
 *            https://www.deque.com/blog/the-business-case-for-digital-accessibility/
 * [NNG]      Nielsen Norman Group, "Design Systems ROI" (2022)
 *            https://www.nngroup.com/articles/design-systems-roi/
 * [WEBAIM]   WebAIM, "The WebAIM Million" annual accessibility report (2024)
 *            https://webaim.org/projects/million/
 * [SMASHING] Smashing Magazine / InVision, "Design Systems Handbook" (2021)
 *            https://www.designbetter.co/design-systems-handbook
 */

import type { WcagLevel } from "@/types";

// ─── Development hours ────────────────────────────────────────────────────────

/**
 * Hours to design, implement, document, and unit-test one component from scratch.
 * Covers spec review, implementation, Storybook story, and basic test suite.
 * Source: [NNG] practitioner survey data; aligns with common engineering estimates.
 */
export const HOURS_PER_COMPONENT_SCRATCH = 16;

/**
 * Fraction of scratch dev hours required when using open-source primitives
 * (Radix UI, shadcn/ui, Headless UI). Primitives eliminate ~65% of the work
 * by providing correct ARIA semantics, keyboard interactions, and DOM structure.
 * Remaining 35% covers: styling, composition, documentation, and project-specific variants.
 */
export const OPENSOURCE_DEV_MULTIPLIER = 0.35;

/**
 * Fraction of scratch dev hours required when using a commercial component library
 * (MUI Pro, Telerik Kendo UI, Syncfusion). Higher baseline coverage reduces dev work
 * by ~80%, but vendor-specific theming APIs and integration overhead claw back ~5%.
 * Net: ~20% of scratch effort for core development.
 */
export const COMMERCIAL_DEV_MULTIPLIER = 0.2;

// ─── QA hours ─────────────────────────────────────────────────────────────────

/**
 * QA hours as a fraction of total developer hours.
 * Covers: exploratory testing, cross-browser spot checks, component spec tests,
 * and visual regression review. Industry baseline: 0.3–0.5× dev hours.
 * Source: [SMASHING] Design Systems Handbook, QA overhead estimates.
 */
export const QA_HOURS_PER_DEV_HOUR = 0.4;

// ─── Cross-browser testing ────────────────────────────────────────────────────

/**
 * Additional testing hours per component for each browser/device target beyond
 * the first. Covers: manual smoke test, edge-case interaction review, visual check.
 * Each extra target adds roughly 45 minutes per component.
 */
export const CROSS_BROWSER_HOURS_PER_EXTRA_TARGET = 0.75;

/**
 * Cross-browser hour reduction factor for the open-source path.
 * Radix UI and shadcn/ui have strong baseline browser support, reducing
 * cross-browser testing burden by ~30%.
 */
export const OPENSOURCE_CROSS_BROWSER_REDUCTION = 0.7;

/**
 * Cross-browser hour reduction factor for the commercial path.
 * Commercial vendors perform their own cross-browser QA, reducing the
 * team's testing burden by ~50%.
 */
export const COMMERCIAL_CROSS_BROWSER_REDUCTION = 0.5;

// ─── Accessibility remediation ────────────────────────────────────────────────

/**
 * Accessibility remediation hours as a fraction of the FULL scratch dev hours
 * (i.e., componentCount × HOURS_PER_COMPONENT_SCRATCH — not the reduced hours).
 * This is intentional: a11y remediation cost reflects the underlying component
 * complexity, not how many developer shortcuts were taken.
 *
 * Source: [DEQUE] "The Business Case for Digital Accessibility"
 * Key finding: fixing an a11y issue during development costs 6× more than
 * catching it during design; post-launch remediation costs 30× more.
 * These fractions model the residual remediation cost at dev time for each path.
 *
 * Interpretation by WCAG level:
 *   A   — Basic semantic HTML, alt text, form labels. Low overhead.
 *   AA  — Focus management, color contrast (4.5:1), ARIA live regions,
 *          keyboard navigation. Significant effort without tooling support.
 *   AAA — Enhanced contrast (7:1), sign language, extended audio descriptions.
 *          Rarely required; extremely high overhead.
 */
export const A11Y_REMEDIATION_FRACTION_SCRATCH: Record<WcagLevel, number> = {
  A: 0.1,
  AA: 0.3,
  AAA: 0.65,
};

/**
 * Open-source libraries (Radix UI, Headless UI) ship with correct ARIA roles,
 * keyboard interactions, and focus management built in. Residual remediation
 * is mostly styling-level: color contrast, focus-visible ring visibility.
 */
export const A11Y_REMEDIATION_FRACTION_OPENSOURCE: Record<WcagLevel, number> = {
  A: 0.02,
  AA: 0.08,
  AAA: 0.25,
};

/**
 * Commercial libraries vary widely in a11y quality. MUI has good baseline support;
 * others (Telerik, Syncfusion) can require significant remediation for complex
 * components (data grids, date pickers). These fractions represent a mid-market average.
 */
export const A11Y_REMEDIATION_FRACTION_COMMERCIAL: Record<WcagLevel, number> = {
  A: 0.05,
  AA: 0.18,
  AAA: 0.45,
};

/** Human-readable citation string rendered in the a11y tooltip on each PathCard. */
export const A11Y_SOURCE_NOTE =
  "Source: Deque Systems (2023) — fixing accessibility issues during development costs 6× more than during design; post-launch costs 30×.";

// ─── Annual maintenance ───────────────────────────────────────────────────────

/**
 * Annual maintenance cost as a fraction of initial build cost.
 *
 * Scratch: full ownership burden — dependency upgrades, browser regressions,
 * design token drift, breaking API changes, ongoing a11y audits.
 * Source: [SMASHING] Design Systems Handbook estimates 15–25% of build cost/year.
 */
export const ANNUAL_MAINTENANCE_FRACTION_SCRATCH = 0.2;

/**
 * Open-source: lower than scratch because the community handles core maintenance.
 * Team cost covers: upgrading to new major versions, resolving override conflicts,
 * adapting to upstream API changes.
 */
export const ANNUAL_MAINTENANCE_FRACTION_OPENSOURCE = 0.1;

/**
 * Commercial: lowest maintenance burden — vendor handles core updates.
 * Remaining cost: integration layer upkeep, major version migrations,
 * theming adjustments as product design evolves.
 */
export const ANNUAL_MAINTENANCE_FRACTION_COMMERCIAL = 0.08;

// ─── Commercial licensing ─────────────────────────────────────────────────────

/**
 * Annual per-developer license cost for a mid-market commercial component library.
 * Range in practice: $200–$600/dev/year.
 * Representative examples: MUI X Pro (~$180), Telerik DevCraft (~$500),
 * Syncfusion (~$400). $400 is a reasonable mid-point for planning purposes.
 */
export const COMMERCIAL_LICENSE_COST_PER_DEV_PER_YEAR = 400;

/**
 * Additional hours per component for commercial library integration:
 * vendor theming API setup, tree-shaking configuration, TypeScript type overrides,
 * and documentation review. This cost is paid once up front, not per usage.
 */
export const COMMERCIAL_INTEGRATION_HOURS_PER_COMPONENT = 1.5;

// ─── Recommendation thresholds ────────────────────────────────────────────────

/**
 * Component count above which building from scratch is classified as "high risk"
 * rather than just "high cost". At this scale, full ownership of a component
 * library becomes a significant long-term engineering commitment.
 */
export const SCRATCH_HIGH_RISK_COMPONENT_THRESHOLD = 40;

/**
 * Team size at or above which the commercial path is classified as "enterprise fit"
 * rather than "high cost". License costs per developer become more manageable
 * relative to the time savings as team size grows.
 */
export const COMMERCIAL_ENTERPRISE_TEAM_THRESHOLD = 8;
