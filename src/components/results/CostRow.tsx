import type { LucideIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./CostRow.module.css";

interface CostRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** If provided, renders an info tooltip beside the label. */
  tooltip?: string;
  /** Visually de-emphasise rows with a zero value (e.g. no license cost). */
  muted?: boolean;
}

export function CostRow({ icon: Icon, label, value, tooltip, muted }: CostRowProps) {
  return (
    <div className={`${styles.row} ${muted ? styles.muted : ""}`}>
      <div className={styles.labelGroup}>
        <Icon size={13} aria-hidden="true" className={styles.icon} />
        <span className={styles.label}>{label}</span>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
