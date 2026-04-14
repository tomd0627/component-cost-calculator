"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CalculatorInputs, CalculatorResults } from "@/types";
import { DEFAULT_INPUTS } from "@/types";
import { calculateResults } from "@/lib/calculator";
import { decodeInputs, encodeInputs, hasCalculatorParams } from "@/lib/url-state";

interface UseCalculatorReturn {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  setInputs: (inputs: CalculatorInputs) => void;
}

/**
 * Manages calculator input state and URL sync.
 *
 * On mount: reads inputs from URL search params (if present), otherwise uses defaults.
 * On change: re-runs calculations immediately and updates the URL with router.replace
 *   (not router.push — we don't want every slider drag to pollute browser history).
 *
 * The results object is memo-ised so downstream components only re-render
 * when the inputs actually change.
 */
export function useCalculator(): UseCalculatorReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialise from URL params on first render; fall back to defaults.
  const initialInputs = useMemo<CalculatorInputs>(() => {
    if (hasCalculatorParams(searchParams)) {
      return { ...DEFAULT_INPUTS, ...decodeInputs(searchParams) };
    }
    return { ...DEFAULT_INPUTS };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — only run once on mount.

  const [inputs, setInputsState] = useState<CalculatorInputs>(initialInputs);

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  const setInputs = useCallback(
    (nextInputs: CalculatorInputs) => {
      setInputsState(nextInputs);
      // Encode and sync to URL without adding a history entry.
      const params = encodeInputs(nextInputs);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  // On initial mount, write defaults to URL if no params present.
  // This ensures the URL is always shareable even before any interaction.
  useEffect(() => {
    if (!hasCalculatorParams(searchParams)) {
      const params = encodeInputs(DEFAULT_INPUTS);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only.

  return { inputs, results, setInputs };
}
