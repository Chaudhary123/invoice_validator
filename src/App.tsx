import InvoiceForm from './components/InvoiceForm';
import InvoiceDisplay from './components/InvoiceDisplay';
import ValidationResults from './components/ValidationResults';
import { useInvoiceValidation } from './hooks/useInvoiceValidation';

const App = () => {
  const {
    invoice,
    validationResult,
    loading,
    error,
    analyzing,
    fetchAndValidate,
    reset,
  } = useInvoiceValidation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-100 to-zinc-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-700 mb-2">
            Invoice Validation Tool
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Fetch invoices from QuickBook or Salesforce and validate calculations
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Column: Form + Validation Results */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Invoice Form */}
            <InvoiceForm
              onSubmit={fetchAndValidate}
              loading={loading}
              onReset={reset}
            />

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                <p className="text-red-700 font-medium text-sm sm:text-base">Error</p>
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Loading State for Validation */}
            {loading && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-400 animate-spin mb-3"
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
                <p className="text-slate-500 text-sm">Fetching invoice...</p>
              </div>
            )}

            {/* Validation Results - Now under the form */}
            {validationResult && (
              <ValidationResults result={validationResult} analyzing={analyzing} />
            )}
          </div>

          {/* Right Column: Invoice Display */}
          <div className="lg:col-span-3">
            {/* Invoice Display */}
            {invoice && <InvoiceDisplay invoice={invoice} />}

            {/* Empty State */}
            {!invoice && !loading && !error && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 sm:p-8 md:p-12 text-center h-full flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-slate-500 text-sm sm:text-base">
                  Enter an invoice ID and select an organization to validate
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Use the quick test IDs to try sample invoices
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-slate-400 text-xs sm:text-sm">
          <p>Powered by rule-based validation + Claude AI analysis</p>
        </div>
      </div>
    </div>
  );
};

export default App;
