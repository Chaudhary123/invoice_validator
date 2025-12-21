import type { Invoice } from '../types/invoice';

interface InvoiceDisplayProps {
  invoice: Invoice;
}

export default function InvoiceDisplay({ invoice }: InvoiceDisplayProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4 sm:mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-700">Invoice Details</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">ID: {invoice.id}</p>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              invoice.organization === 'quickBook'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-sky-50 text-sky-700 border border-sky-200'
            }`}
          >
            {invoice.organization === 'quickBook' ? 'QuickBook' : 'Salesforce'}
          </span>
          <p className="text-xs sm:text-sm text-slate-400 sm:mt-2">{invoice.date}</p>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-slate-400">Vendor</p>
        <p className="text-base sm:text-lg font-semibold text-slate-700">{invoice.vendor}</p>
      </div>

      {/* Line Items Table */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-semibold text-slate-600 mb-2 sm:mb-3 text-sm sm:text-base">Line Items</h4>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[400px] sm:min-w-0 px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-2 sm:px-4 py-2 text-left text-slate-500 font-medium rounded-l-lg">Description</th>
                  <th className="px-2 sm:px-4 py-2 text-right text-slate-500 font-medium">Qty</th>
                  <th className="px-2 sm:px-4 py-2 text-right text-slate-500 font-medium">Unit Price</th>
                  <th className="px-2 sm:px-4 py-2 text-right text-slate-500 font-medium rounded-r-lg">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50">
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-slate-700">{item.description}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right text-slate-500">{item.quantity}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right text-slate-500">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right font-medium text-slate-700">
                      ${item.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax ({(invoice.taxRate * 100).toFixed(1)}%)</span>
            <span>${invoice.taxAmount.toFixed(2)}</span>
          </div>
          {invoice.discounts > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discounts</span>
              <span>-${invoice.discounts.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base sm:text-lg font-bold text-slate-700 pt-2 border-t border-slate-200">
            <span>Grand Total</span>
            <span>${invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
