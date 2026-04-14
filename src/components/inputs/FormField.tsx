import { useId } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string, describedBy: string | undefined) => React.ReactNode;
}

/**
 * Wrapper that wires a label, optional hint, and optional error message
 * to the child input via id + aria-describedby. The child render prop
 * receives the generated id and describedBy string — keeping logic here,
 * not scattered across input components.
 */
export function FormField({ label, hint, error, children }: FormFieldProps) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {children(inputId, describedBy)}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
