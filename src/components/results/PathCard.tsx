import type { PathCostBreakdown } from "@/types";
import { formatCurrency, formatHours } from "@/lib/formatters";
import {
  Code2,
  TestTube2,
  ShieldCheck,
  Globe,
  Plug,
  RefreshCw,
  BadgeDollarSign,
  CalendarDays,
} from "lucide-react";
import { RecommendationBadge } from "./RecommendationBadge";
import { CostRow } from "./CostRow";
import styles from "./PathCard.module.css";

interface PathCardProps {
  path: PathCostBreakdown;
  isHighlighted?: boolean;
}

export function PathCard({ path, isHighlighted }: PathCardProps) {
  const accentVar = `var(--color-path-${path.pathId})`;

  return (
    <article
      className={`${styles.card} ${isHighlighted ? styles.highlighted : ""}`}
      aria-label={path.label}
      style={isHighlighted ? { "--card-accent": accentVar } as React.CSSProperties : undefined}
    >
      {/* Header */}
      <div className={styles.header}>
        <RecommendationBadge tag={path.recommendation} risk={path.risk} />
        <h3 className={styles.title}>{path.label}</h3>
        <p className={styles.tagline}>{path.tagline}</p>
      </div>

      {/* Examples */}
      <p className={styles.examples}>e.g. {path.examples}</p>

      {/* Total */}
      <div className={styles.totalBlock} style={{ "--accent": accentVar } as React.CSSProperties}>
        <span className={styles.totalLabel}>First-year total</span>
        <span className={styles.totalValue}>{formatCurrency(path.firstYearTotalCost)}</span>
      </div>

      {/* Line items */}
      <div className={styles.breakdown}>
        <CostRow
          icon={Code2}
          label="Dev hours"
          value={formatHours(path.devHours)}
        />
        {path.integrationHours > 0 && (
          <CostRow
            icon={Plug}
            label="Integration"
            value={formatHours(path.integrationHours)}
            tooltip="Vendor-specific theming, tree-shaking config, and TypeScript type overrides."
          />
        )}
        <CostRow
          icon={ShieldCheck}
          label="A11y remediation"
          value={formatHours(path.a11yRemediationHours)}
          tooltip={path.a11ySourceNote}
        />
        <CostRow
          icon={Globe}
          label="Cross-browser testing"
          value={formatHours(path.crossBrowserHours)}
        />
        <CostRow
          icon={TestTube2}
          label="QA"
          value={formatHours(path.qaHours)}
        />
        <CostRow
          icon={CalendarDays}
          label="Total build hours"
          value={formatHours(path.totalBuildHours)}
        />
        <CostRow
          icon={RefreshCw}
          label="Annual maintenance"
          value={formatCurrency(path.annualMaintenanceCost)}
        />
        <CostRow
          icon={BadgeDollarSign}
          label="License cost"
          value={path.licenseCost > 0 ? formatCurrency(path.licenseCost) : "Free"}
          muted={path.licenseCost === 0}
        />
      </div>
    </article>
  );
}
