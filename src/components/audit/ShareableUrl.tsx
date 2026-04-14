"use client";

import { useState } from "react";
import { Link, Check } from "lucide-react";
import styles from "./ShareableUrl.module.css";

/**
 * Copies the current URL (which already contains encoded calculator inputs
 * via the useCalculator hook's router.replace calls) to the clipboard.
 * Falls back to showing the URL in a text field if clipboard API is unavailable.
 */
export function ShareableUrl() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API blocked (e.g., http context) — select the URL bar text manually
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={styles.button}
      aria-label={copied ? "Link copied to clipboard" : "Copy shareable link"}
    >
      {copied ? (
        <Check size={14} aria-hidden="true" className={styles.checkIcon} />
      ) : (
        <Link size={14} aria-hidden="true" />
      )}
      {copied ? "Link copied!" : "Copy shareable link"}
    </button>
  );
}
