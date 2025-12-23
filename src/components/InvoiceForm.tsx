import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ORGANIZATIONS, ORGANIZATION_KEYS } from '../types/invoice';
import type { OrganizationType } from '../types/invoice';

interface InvoiceFormProps {
  onSubmit: (invoiceId: string, organization: OrganizationType, useLLM: boolean) => void;
  loading: boolean;
  onReset: () => void;
}

export default function InvoiceForm({ onSubmit, loading, onReset }: InvoiceFormProps) {
  const [organization, setOrganization] = useState<OrganizationType>('quickBook');
  const [invoiceId, setInvoiceId] = useState('');
  const [useLLM, setUseLLM] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (invoiceId.trim()) {
      onSubmit(invoiceId.trim(), organization, useLLM);
    }
  };

  const handleOrganizationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrganization(e.target.value as OrganizationType);
  };

  const handleInvoiceIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvoiceId(e.target.value);
  };

  const handleReset = () => {
    setInvoiceId('');
    onReset();
  };

  // Get sample invoice IDs from central config
  const sampleIds = ORGANIZATIONS[organization].sampleInvoiceIds;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-4 sm:mb-6">Invoice Validator</h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Organization Select */}
        <div>
          <label htmlFor="organization" className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5 sm:mb-2">
            Organization
          </label>
          <select
            id="organization"
            value={organization}
            onChange={handleOrganizationChange}
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            {ORGANIZATION_KEYS.map((key) => (
              <option key={key} value={key}>
                {ORGANIZATIONS[key].displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice ID Input */}
        <div>
          <label htmlFor="invoiceId" className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5 sm:mb-2">
            Invoice ID
          </label>
          <input
            type="text"
            id="invoiceId"
            value={invoiceId}
            onChange={handleInvoiceIdChange}
            placeholder="Enter invoice ID (e.g., QB-INV-001)"
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition bg-white disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300"
          />
        </div>

        {/* Sample IDs Helper */}
        <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Quick test IDs for {ORGANIZATIONS[organization].displayName}:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setInvoiceId(id)}
                disabled={loading}
                className="px-2 py-1 text-[10px] sm:text-xs bg-white border border-slate-200 rounded-md hover:bg-slate-100 hover:border-slate-300 transition disabled:opacity-50 text-slate-600"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* LLM Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="checkbox"
            id="useLLM"
            checked={useLLM}
            onChange={(e) => setUseLLM(e.target.checked)}
            disabled={loading}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-400"
          />
          <label htmlFor="useLLM" className="text-xs sm:text-sm text-slate-600">
            Enable AI Analysis (Claude)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="submit"
            disabled={loading || !invoiceId.trim()}
            className="flex-1 bg-slate-700 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-slate-800 transition font-medium text-sm sm:text-base disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="hidden sm:inline">Fetching...</span>
              </>
            ) : (
              'Validate Invoice'
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 text-sm sm:text-base"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
