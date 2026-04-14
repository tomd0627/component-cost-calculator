"use client";

import { RotateCcw } from "lucide-react";
import type { CalculatorInputs, WcagLevel } from "@/types";
import { DEFAULT_INPUTS } from "@/types";
import { NumberInput } from "./NumberInput";
import { SelectInput } from "./SelectInput";
import styles from "./InputForm.module.css";

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const WCAG_OPTIONS: { value: WcagLevel; label: string }[] = [
  { value: "A",   label: "WCAG A — Basic accessibility" },
  { value: "AA",  label: "WCAG AA — Standard requirement (recommended)" },
  { value: "AAA", label: "WCAG AAA — Enhanced / legal compliance" },
];

export function InputForm({ inputs, onChange }: InputFormProps) {
  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  function reset() {
    onChange({ ...DEFAULT_INPUTS });
  }

  return (
    <form
      className={styles.form}
      aria-label="Calculator inputs"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Your Project</h2>
        <button type="button" onClick={reset} className={styles.resetBtn} aria-label="Reset all inputs to defaults">
          <RotateCcw size={13} aria-hidden="true" />
          Reset
        </button>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Team</legend>
        <NumberInput
          label="Team size"
          value={inputs.teamSize}
          min={1}
          max={20}
          suffix="devs"
          hint="Number of developers who will use the library."
          onChange={(v) => update("teamSize", v)}
        />
        <NumberInput
          label="QA headcount"
          value={inputs.qaHeadcount}
          min={1}
          max={10}
          suffix="QA engineers"
          hint="Dedicated QA engineers on the project."
          onChange={(v) => update("qaHeadcount", v)}
        />
        <NumberInput
          label="Hourly rate"
          value={inputs.hourlyRate}
          min={50}
          max={500}
          prefix="$"
          suffix="/hr"
          hint="Fully-loaded cost per developer (salary + benefits + overhead)."
          onChange={(v) => update("hourlyRate", v)}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Scope</legend>
        <NumberInput
          label="Components needed"
          value={inputs.componentCount}
          min={1}
          max={200}
          hint="Total number of UI components to design, build, and maintain."
          onChange={(v) => update("componentCount", v)}
        />
        <NumberInput
          label="Timeline"
          value={inputs.timelineWeeks}
          min={4}
          max={52}
          suffix="weeks"
          hint="Available build window before first major release."
          onChange={(v) => update("timelineWeeks", v)}
        />
        <NumberInput
          label="Browser / device targets"
          value={inputs.browserCount}
          min={1}
          max={6}
          hint="Each additional target beyond 1 adds cross-browser testing cost."
          onChange={(v) => update("browserCount", v)}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Accessibility</legend>
        <SelectInput
          label="Target WCAG level"
          value={inputs.wcagLevel}
          options={WCAG_OPTIONS}
          hint="Higher levels require significantly more remediation effort — especially when building from scratch."
          onChange={(v) => update("wcagLevel", v)}
        />
      </fieldset>
    </form>
  );
}
