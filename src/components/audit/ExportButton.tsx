"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import styles from "./ExportButton.module.css";

interface ExportButtonProps {
  filename?: string;
}

export function ExportButton({ filename = "component-cost-estimate" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const announcerRef = useRef<HTMLSpanElement>(null);

  async function handleExport() {
    const target = document.getElementById("audit-card");
    if (!target) return;

    setLoading(true);
    setError(null);

    // Force light mode on <html> during capture so CSS custom properties
    // cascade correctly and the PDF is always rendered on a white background.
    const html = document.documentElement;
    const originalTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "light");

    try {
      // Dynamic imports keep html2canvas + jsPDF out of the initial bundle.
      // Both reference window/document so they must not run during SSR.
      // jsPDF v4 uses a default export; v2 used a named export.
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`);

      if (announcerRef.current) {
        announcerRef.current.textContent = "PDF downloaded successfully.";
      }
    } catch {
      // Fallback: open the print dialog which most browsers can save as PDF
      setError("PDF generation failed — opening print dialog as fallback.");
      window.print();
    } finally {
      // Restore the original theme on <html>
      if (originalTheme !== null) {
        html.setAttribute("data-theme", originalTheme);
      } else {
        html.removeAttribute("data-theme");
      }
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        aria-busy={loading}
        className={styles.button}
      >
        {loading ? (
          <Loader2 size={15} aria-hidden="true" className={styles.spinner} />
        ) : (
          <Download size={15} aria-hidden="true" />
        )}
        {loading ? "Generating PDF…" : "Download Audit Card (PDF)"}
      </button>

      {/* Live region announces completion to screen readers */}
      <span ref={announcerRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {error && (
        <p className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
