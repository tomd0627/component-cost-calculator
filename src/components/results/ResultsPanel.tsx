import type { CalculatorResults } from "@/types";
import { PathCard } from "./PathCard";
import { ComparisonBar } from "./ComparisonBar";
import styles from "./ResultsPanel.module.css";

interface ResultsPanelProps {
  results: CalculatorResults;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const { paths, cheapestPathId } = results;

  return (
    <section aria-labelledby="results-heading" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 id="results-heading" className={styles.heading}>
          Cost Comparison
        </h2>
        <p className={styles.subheading}>
          First-year total including build, QA, accessibility remediation, maintenance, and licensing.
        </p>
      </div>

      <ComparisonBar paths={paths} />

      <div className={styles.grid}>
        {paths.map((path) => (
          <PathCard
            key={path.pathId}
            path={path}
            isHighlighted={path.pathId === cheapestPathId}
          />
        ))}
      </div>
    </section>
  );
}
