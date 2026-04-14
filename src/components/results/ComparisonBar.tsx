import type { PathCostBreakdown } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import styles from "./ComparisonBar.module.css";

interface ComparisonBarProps {
  paths: [PathCostBreakdown, PathCostBreakdown, PathCostBreakdown];
}

export function ComparisonBar({ paths }: ComparisonBarProps) {
  const max = Math.max(...paths.map((p) => p.firstYearTotalCost));
  const ariaLabel = paths
    .map((p) => `${p.label}: ${formatCurrency(p.firstYearTotalCost)}`)
    .join(", ");

  return (
    <div
      className={styles.wrapper}
      role="img"
      aria-label={`Cost comparison: ${ariaLabel}`}
    >
      {paths.map((path) => {
        const pct = max === 0 ? 0 : (path.firstYearTotalCost / max) * 100;

        return (
          <div key={path.pathId} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.label}>{path.label}</span>
              <span className={styles.value}>
                {formatCurrency(path.firstYearTotalCost)}
              </span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{
                  width: `${Math.max(pct, 0.5)}%`,
                  background: `var(--color-path-${path.pathId})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
