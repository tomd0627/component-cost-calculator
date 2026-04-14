/**
 * Pure formatting utilities. No business logic — only presentation transforms.
 * All functions accept primitives and return strings safe to render in React.
 */

import type { RecommendationTag, RiskLevel } from "@/types";

// ─── Currency ─────────────────────────────────────────────────────────────────

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$12,500" */
export function formatCurrency(value: number): string {
  return USD.format(Math.round(value));
}

// ─── Hours ────────────────────────────────────────────────────────────────────

/** "420 hrs" */
export function formatHours(hours: number): string {
  return `${Math.round(hours).toLocaleString("en-US")} hrs`;
}

// ─── Risk ─────────────────────────────────────────────────────────────────────

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

export function formatRiskLabel(risk: RiskLevel): string {
  return RISK_LABELS[risk];
}

// ─── Recommendation ───────────────────────────────────────────────────────────

const RECOMMENDATION_LABELS: Record<RecommendationTag, string> = {
  recommended: "Recommended",
  "best-value": "Best Value",
  "high-risk": "High Risk",
  "high-cost": "High Cost",
  "enterprise-fit": "Enterprise Fit",
};

export function formatRecommendationLabel(tag: RecommendationTag): string {
  return RECOMMENDATION_LABELS[tag];
}

// ─── Date ─────────────────────────────────────────────────────────────────────

/** "April 13, 2026 at 3:45 PM" */
export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Percentage ───────────────────────────────────────────────────────────────

/** "23%" */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
