"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
}

/**
 * A lightweight accessible tooltip using aria-describedby.
 * Visible on hover and on focus (keyboard accessible).
 * No JS positioning library needed — CSS handles placement.
 */
export function Tooltip({ content }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="More information"
        aria-describedby={visible ? id : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <Info size={13} aria-hidden="true" />
      </button>
      {visible && (
        <span id={id} role="tooltip" className={styles.tooltip}>
          {content}
        </span>
      )}
    </span>
  );
}
