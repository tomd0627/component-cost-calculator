import type { PathCostBreakdown } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import styles from "./ComparisonBar.module.css";

interface ComparisonBarProps {
  paths: [PathCostBreakdown, PathCostBreakdown, PathCostBreakdown];
}

/**
 * A simple SVG horizontal bar chart showing relative first-year cost.
 * No charting library — the math is trivial and the accessibility
 * attributes (role, aria-label) are easier to control directly.
 */
export function ComparisonBar({ paths }: ComparisonBarProps) {
  const max = Math.max(...paths.map((p) => p.firstYearTotalCost));
  const BAR_HEIGHT = 28;
  const GAP = 10;
  const LABEL_WIDTH = 140;
  const VALUE_WIDTH = 90;
  const SVG_HEIGHT = paths.length * (BAR_HEIGHT + GAP) - GAP;

  const ariaLabel = paths
    .map((p) => `${p.label}: ${formatCurrency(p.firstYearTotalCost)}`)
    .join(", ");

  return (
    <div className={styles.wrapper}>
      <svg
        role="img"
        aria-label={`Cost comparison: ${ariaLabel}`}
        viewBox={`0 0 600 ${SVG_HEIGHT}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((path, i) => {
          const y = i * (BAR_HEIGHT + GAP);
          const barWidth = max === 0 ? 0 : (path.firstYearTotalCost / max) * (600 - LABEL_WIDTH - VALUE_WIDTH - 16);
          const accentColor = `var(--color-path-${path.pathId})`;

          return (
            <g key={path.pathId}>
              {/* Label */}
              <text
                x={LABEL_WIDTH - 8}
                y={y + BAR_HEIGHT / 2}
                textAnchor="end"
                dominantBaseline="central"
                className={styles.label}
              >
                {path.label}
              </text>

              {/* Track */}
              <rect
                x={LABEL_WIDTH}
                y={y}
                width={600 - LABEL_WIDTH - VALUE_WIDTH - 16}
                height={BAR_HEIGHT}
                rx={4}
                className={styles.track}
              />

              {/* Bar */}
              <rect
                x={LABEL_WIDTH}
                y={y}
                width={Math.max(barWidth, 4)}
                height={BAR_HEIGHT}
                rx={4}
                fill={accentColor}
                opacity={0.85}
              />

              {/* Value */}
              <text
                x={LABEL_WIDTH + (600 - LABEL_WIDTH - VALUE_WIDTH - 16) + 8}
                y={y + BAR_HEIGHT / 2}
                dominantBaseline="central"
                className={styles.value}
              >
                {formatCurrency(path.firstYearTotalCost)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
