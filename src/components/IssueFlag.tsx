import type { ValidationIssue } from '../types/invoice';

interface IssueFlagProps {
  issue: ValidationIssue;
}

export default function IssueFlag({ issue }: IssueFlagProps) {
  const isError = issue.severity === 'error';

  return (
    <div
      className={`p-3 sm:p-4 rounded-lg border-l-4 ${
        isError
          ? 'bg-rose-50 border-rose-400'
          : 'bg-amber-50 border-amber-400'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        {/* Severity Badge */}
        <span
          className={`px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded uppercase self-start ${
            isError
              ? 'bg-rose-100 text-rose-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {issue.severity}
        </span>

        <div className="flex-1 min-w-0">
          {/* Field Name */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
            Field: <code className="bg-white/60 px-1.5 py-0.5 rounded text-[10px] sm:text-xs break-all">{issue.field}</code>
          </p>

          {/* Message */}
          <p className={`text-xs sm:text-sm leading-relaxed ${isError ? 'text-rose-700' : 'text-amber-700'}`}>
            {issue.message}
          </p>

          {/* Expected vs Actual (only show if meaningful) */}
          {issue.expected !== issue.actual && issue.expected !== 0 && (
            <div className="mt-2 text-[10px] sm:text-xs text-slate-500 flex flex-wrap gap-2 sm:gap-4">
              <span>
                Expected: <strong className="text-emerald-600">${issue.expected.toFixed(2)}</strong>
              </span>
              <span>
                Actual: <strong className="text-rose-600">${issue.actual.toFixed(2)}</strong>
              </span>
              <span>
                Diff:{' '}
                <strong className="text-amber-600">
                  ${Math.abs(issue.expected - issue.actual).toFixed(2)}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
