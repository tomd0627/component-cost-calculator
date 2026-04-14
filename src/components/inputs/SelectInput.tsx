"use client";

import { ChevronDown } from "lucide-react";
import { FormField } from "./FormField";
import styles from "./SelectInput.module.css";

interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  hint?: string;
  onChange: (value: T) => void;
}

export function SelectInput<T extends string>({
  label,
  value,
  options,
  hint,
  onChange,
}: SelectInputProps<T>) {
  return (
    <FormField label={label} hint={hint}>
      {(id, describedBy) => (
        <div className={styles.wrapper}>
          <select
            id={id}
            value={value}
            aria-describedby={describedBy}
            className={styles.select}
            onChange={(e) => onChange(e.target.value as T)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
        </div>
      )}
    </FormField>
  );
}
