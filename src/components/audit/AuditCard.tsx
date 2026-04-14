import type { CalculatorResults } from "@/types";
import { formatCurrency, formatHours, formatTimestamp } from "@/lib/formatters";
import styles from "./AuditCard.module.css";

interface AuditCardProps {
  results: CalculatorResults;
}

/**
 * The export-target card. This component renders a self-contained summary
 * that html2canvas can capture cleanly. It always uses light-mode styles
 * (data-theme="light" applied before capture) so the PDF has a clean
 * white background regardless of the user's current theme preference.
 *
 * Keep this component layout-stable: no sticky positioning, no viewport-
 * relative units, no CSS that depends on scroll position.
 */
export function AuditCard({ results }: AuditCardProps) {
  const { inputs, paths, cheapestPathId, generatedAt } = results;

  return (
    <div id="audit-card" className={styles.card} aria-label="Audit card summary">
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Component Library Cost Estimate</h3>
          <p className={styles.cardMeta}>Generated {formatTimestamp(generatedAt)}</p>
        </div>
        <div className={styles.stamp} aria-hidden="true">
          componentcostcalculator
        </div>
      </div>

      {/* Input summary */}
      <div className={styles.inputSummary}>
        <h4 className={styles.sectionLabel}>Project Inputs</h4>
        <dl className={styles.inputGrid}>
          <div className={styles.inputItem}>
            <dt>Components</dt>
            <dd>{inputs.componentCount}</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>Hourly rate</dt>
            <dd>{formatCurrency(inputs.hourlyRate)}/hr</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>Team size</dt>
            <dd>{inputs.teamSize} devs</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>QA headcount</dt>
            <dd>{inputs.qaHeadcount}</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>Browser targets</dt>
            <dd>{inputs.browserCount}</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>WCAG level</dt>
            <dd>{inputs.wcagLevel}</dd>
          </div>
          <div className={styles.inputItem}>
            <dt>Timeline</dt>
            <dd>{inputs.timelineWeeks} weeks</dd>
          </div>
        </dl>
      </div>

      {/* Cost comparison table */}
      <div className={styles.comparisonSection}>
        <h4 className={styles.sectionLabel}>First-Year Cost Breakdown</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.thLabel}>Path</th>
              <th scope="col" className={styles.th}>Dev Hours</th>
              <th scope="col" className={styles.th}>A11y Remediation</th>
              <th scope="col" className={styles.th}>QA Hours</th>
              <th scope="col" className={styles.th}>License</th>
              <th scope="col" className={styles.th}>Maintenance</th>
              <th scope="col" className={`${styles.th} ${styles.thTotal}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {paths.map((path) => (
              <tr
                key={path.pathId}
                className={path.pathId === cheapestPathId ? styles.trHighlighted : ""}
              >
                <td className={styles.tdLabel}>
                  {path.label}
                  {path.pathId === cheapestPathId && (
                    <span className={styles.cheapestBadge}>Recommended</span>
                  )}
                </td>
                <td className={styles.td}>{formatHours(path.devHours)}</td>
                <td className={styles.td}>{formatHours(path.a11yRemediationHours)}</td>
                <td className={styles.td}>{formatHours(path.qaHours)}</td>
                <td className={styles.td}>
                  {path.licenseCost > 0 ? formatCurrency(path.licenseCost) : "—"}
                </td>
                <td className={styles.td}>{formatCurrency(path.annualMaintenanceCost)}</td>
                <td className={`${styles.td} ${styles.tdTotal}`}>
                  {formatCurrency(path.firstYearTotalCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <p className={styles.disclaimer}>
        Estimates based on: Deque Systems, Nielsen Norman Group, WebAIM Million Report,
        and the InVision Design Systems Handbook. Figures are industry averages — actual
        costs will vary based on team velocity, component complexity, and tooling.
      </p>
    </div>
  );
}
