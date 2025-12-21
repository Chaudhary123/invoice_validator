import { useState, useCallback } from 'react';
import type { Invoice, ValidationResult, OrganizationType } from '../types/invoice';
import { fetchInvoice } from '../services/invoiceService';
import { validateAll } from '../validation/rules';
import { performFullAnalysis } from '../validation/llmAnalyzer';

interface UseInvoiceValidationState {
  invoice: Invoice | null;
  validationResult: ValidationResult | null;
  loading: boolean;
  error: string | null;
  analyzing: boolean;
}

interface UseInvoiceValidationReturn extends UseInvoiceValidationState {
  fetchAndValidate: (invoiceId: string, organization: OrganizationType, useLLM?: boolean) => Promise<void>;
  reset: () => void;
}

export function useInvoiceValidation(): UseInvoiceValidationReturn {
  const [state, setState] = useState<UseInvoiceValidationState>({
    invoice: null,
    validationResult: null,
    loading: false,
    error: null,
    analyzing: false,
  });

  const fetchAndValidate = useCallback(
    async (invoiceId: string, organization: OrganizationType, useLLM: boolean = true) => {
      // Reset and start loading
      setState({
        invoice: null,
        validationResult: null,
        loading: true,
        error: null,
        analyzing: false,
      });

      try {
        // Step 1: Fetch the invoice
        const invoice = await fetchInvoice(invoiceId, organization);

        // Update state with fetched invoice
        setState((prev) => ({
          ...prev,
          invoice,
          loading: false,
          analyzing: useLLM,
        }));

        // Step 2: Run rule-based validation
        const ruleBasedResult = validateAll(invoice);

        // Step 3: If LLM is enabled, perform full analysis
        if (useLLM) {
          const fullResult = await performFullAnalysis(invoice, ruleBasedResult);
          setState((prev) => ({
            ...prev,
            validationResult: fullResult,
            analyzing: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            validationResult: ruleBasedResult,
            analyzing: false,
          }));
        }
      } catch (err) {
        setState({
          invoice: null,
          validationResult: null,
          loading: false,
          error: err instanceof Error ? err.message : 'An error occurred',
          analyzing: false,
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      invoice: null,
      validationResult: null,
      loading: false,
      error: null,
      analyzing: false,
    });
  }, []);

  return {
    ...state,
    fetchAndValidate,
    reset,
  };
}
