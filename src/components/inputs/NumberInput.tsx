"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import styles from "./NumberInput.module.css";

interface NumberInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  onChange: (value: number) => void;
}

export function NumberInput({
  label,
  value,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
  onChange,
}: NumberInputProps) {
  const [raw, setRaw] = useState(String(value));
  const [error, setError] = useState<string | undefined>();

  // Keep raw in sync when the parent resets the value (e.g. reset button)
  const displayValue = error ? raw : String(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setRaw(text);

    const n = Number(text);
    if (!Number.isFinite(n) || n < min || n > max) {
      setError(`Enter a value between ${min} and ${max}`);
      return;
    }
    setError(undefined);
    onChange(Math.round(n));
  }

  function handleBlur() {
    // Snap to valid value on blur if the raw input was invalid
    if (error) {
      const clamped = Math.min(max, Math.max(min, Number(raw) || min));
      setRaw(String(clamped));
      setError(undefined);
      onChange(clamped);
    }
  }

  return (
    <FormField label={label} hint={hint} error={error}>
      {(id, describedBy) => (
        <div className={styles.inputWrapper}>
          {prefix && (
            <span className={styles.adornment} aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            value={displayValue}
            min={min}
            max={max}
            step={step}
            aria-describedby={describedBy}
            aria-invalid={error ? "true" : undefined}
            className={styles.input}
            style={{ paddingLeft: prefix ? "2rem" : undefined }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {suffix && (
            <span className={styles.suffix} aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>
      )}
    </FormField>
  );
}
