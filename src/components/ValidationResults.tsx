import type { ValidationResult } from '../types/invoice';
import IssueFlag from './IssueFlag';

interface ValidationResultsProps {
  result: ValidationResult;
  analyzing?: boolean;
}

export default function ValidationResults({ result, analyzing }: ValidationResultsProps) {
  const errorCount = result.issues.filter((i) => i.severity === 'error').length;
  const warningCount = result.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6">
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-700">Validation Results</h3>

        {/* Status Badge */}
        <div
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm text-center ${
            result.isValid
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {result.isValid ? 'Valid Invoice' : 'Issues Found'}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-slate-50 rounded-lg p-2.5 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-slate-700">{result.issues.length}</p>
          <p className="text-[10px] sm:text-sm text-slate-500">Total Issues</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-2.5 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-rose-600">{errorCount}</p>
          <p className="text-[10px] sm:text-sm text-slate-500">Errors</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-2.5 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{warningCount}</p>
          <p className="text-[10px] sm:text-sm text-slate-500">Warnings</p>
        </div>
      </div>

      {/* Issues List */}
      {result.issues.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-semibold text-slate-600 mb-2 sm:mb-3 text-sm sm:text-base">Detected Issues:</h4>
          {result.issues.map((issue, index) => (
            <IssueFlag key={index} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-emerald-600">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-base sm:text-lg font-medium">All calculations are correct!</p>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">No issues detected in this invoice.</p>
        </div>
      )}

      {/* LLM Analysis Loading */}
      {analyzing && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-sky-50 rounded-lg border border-sky-100">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 animate-spin"
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
            <p className="text-sky-700 text-xs sm:text-sm">AI is analyzing the invoice...</p>
          </div>
        </div>
      )}

      {/* LLM Analysis Result */}
      {result.llmAnalysis && (
        <div className="mt-4 sm:mt-6">
          <h4 className="font-semibold text-slate-600 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Analysis (Claude)
          </h4>
          <div className="bg-violet-50 rounded-lg p-3 sm:p-4 border border-violet-100">
            <pre className="whitespace-pre-wrap text-[10px] sm:text-sm text-slate-600 font-mono leading-relaxed">
              {result.llmAnalysis}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
