"use client";

import { Suspense } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { InputForm } from "@/components/inputs/InputForm";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { AuditCard } from "@/components/audit/AuditCard";
import { ExportButton } from "@/components/audit/ExportButton";
import { ShareableUrl } from "@/components/audit/ShareableUrl";
import { MethodologySection } from "@/components/methodology/MethodologySection";
import styles from "./page.module.css";

/**
 * The inner page component that uses useSearchParams (via useCalculator).
 * Wrapped in <Suspense> in the default export to satisfy Next.js App Router
 * requirements for client components that read search params.
 */
function CalculatorPage() {
  const { inputs, results, setInputs } = useCalculator();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <h1 id="hero-heading" className={styles.heroTitle}>
            Should you build,{" "}
            <span className={styles.accent}>borrow</span>,{" "}
            or buy?
          </h1>
          <p className={styles.heroSubtitle}>
            A research-backed cost calculator for the design system decision every front-end team faces.
            Enter your project details and get a side-by-side estimate — including the accessibility
            debt most analyses ignore.
          </p>
        </div>
      </section>

      {/* ── Calculator ────────────────────────────────────────────────── */}
      <div className={`container ${styles.calculatorLayout}`}>
        {/* Left: Inputs */}
        <aside aria-label="Calculator inputs">
          <InputForm inputs={inputs} onChange={setInputs} />
        </aside>

        {/* Right: Results */}
        <div className={styles.resultsColumn}>
          <ResultsPanel results={results} />
        </div>
      </div>

      {/* ── Export ────────────────────────────────────────────────────── */}
      <div className="container">
        <section aria-labelledby="export-heading" className={styles.exportSection}>
          <div className={styles.exportHeader}>
            <h2 id="export-heading" className={styles.sectionTitle}>
              Export Audit Card
            </h2>
            <p className={styles.sectionSubtitle}>
              Download a clean PDF summary suitable for Confluence, Slack, or a leadership review.
            </p>
          </div>

          <div className={styles.exportActions}>
            <ExportButton />
            <ShareableUrl />
          </div>

          <AuditCard results={results} />
        </section>

        {/* ── Methodology ───────────────────────────────────────────────── */}
        <MethodologySection />
      </div>
    </>
  );
}

/**
 * Default export wraps CalculatorPage in Suspense.
 * Next.js App Router requires this for any client component that reads
 * useSearchParams() — without it, the build will throw.
 */
export default function Page() {
  return (
    <Suspense>
      <CalculatorPage />
    </Suspense>
  );
}
