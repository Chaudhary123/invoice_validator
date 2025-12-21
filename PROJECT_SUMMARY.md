# Invoice Validation Tool - Project Summary

## Overview
A React + TypeScript application that fetches invoices from QuickBook or Salesforce and validates them for calculation errors using rule-based logic and Claude AI analysis.

---

## Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool |
| Tailwind CSS | 4.1.17 | Styling |
| @anthropic-ai/sdk | latest | Claude AI Integration |

---

## Project Structure
```
src/
├── types/
│   └── invoice.ts              # TypeScript interfaces
├── services/
│   ├── mockData.ts             # Sample invoices (valid + buggy)
│   └── invoiceService.ts       # API abstraction layer
├── validation/
│   ├── rules.ts                # Rule-based validators
│   └── llmAnalyzer.ts          # Claude AI integration
├── hooks/
│   └── useInvoiceValidation.ts # Custom hook for fetch + validate
├── components/
│   ├── InvoiceForm.tsx         # Search form with quick-test IDs
│   ├── InvoiceDisplay.tsx      # Invoice details table
│   ├── ValidationResults.tsx   # Results with issue counts
│   └── IssueFlag.tsx           # Individual error/warning display
├── App.tsx                     # Main application component
├── Form.tsx                    # Original form (unused)
├── main.tsx                    # Entry point
├── index.css                   # Tailwind imports
└── vite-env.d.ts               # Environment type declarations
```

---

## Key Features

### 1. Invoice Fetching
- Supports QuickBook and Salesforce organizations
- Abstract service layer for easy real API integration later
- Mock data with simulated network delay (800ms)

### 2. Rule-Based Validation
| Rule | Check |
|------|-------|
| Line Items | `quantity × unitPrice = lineTotal` |
| Subtotal | `sum(lineTotals) = subtotal` |
| Tax | `subtotal × taxRate = taxAmount` |
| Grand Total | `subtotal + tax - discounts = grandTotal` |
| Unusual Patterns | Negative values, high tax rates, etc. |

### 3. Claude AI Analysis
- Uses Claude 3.5 Sonnet model
- Analyzes invoice for complex patterns
- Provides detailed insights beyond rule-based checks
- Requires `VITE_ANTHROPIC_API_KEY` in `.env`

### 4. Responsive UI
- Mobile-first design with Tailwind breakpoints
- Soothing color palette (slate, stone, zinc gradients)
- Semi-transparent cards with backdrop blur
- Validation Results positioned under form (left column)
- Invoice Details on right column (scrollable for large invoices)

---

## Test Invoices Available

### QuickBook
| ID | Status | Bug |
|----|--------|-----|
| QB-INV-001 | Valid | None |
| QB-INV-002 | Invalid | Line item total wrong (290 instead of 300) |
| QB-INV-003 | Invalid | Tax calculation wrong (40 instead of 37.10) |

### Salesforce
| ID | Status | Bug |
|----|--------|-----|
| SF-INV-001 | Valid | None |
| SF-INV-002 | Invalid | Subtotal wrong (1900 instead of 2000) |
| SF-INV-003 | Invalid | Grand total wrong (2100 instead of 2080) |
| SF-INV-004 | Valid | None |

---

## Environment Setup

### .env file (create in project root)
```
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
```

**Note:** The `.env` file is gitignored for security.

---

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Git Repository

- **Remote:** https://github.com/Chaudhary123/invoice_validator.git
- **Branch:** master

### Commits Made
1. `04b8736` - Initial commit: Invoice Validation Tool
2. `191a6e7` - Updated title to "Invoice Validator"

---

## Future Enhancements (Ready for Implementation)

1. **Real API Integration**
   - Replace mock services with actual QuickBook/Salesforce APIs
   - Add OAuth authentication for Salesforce
   - Add API key authentication for QuickBook

2. **Additional Validation Rules**
   - Currency validation
   - Date range checks
   - Duplicate invoice detection

3. **Export Features**
   - Download validation report as PDF
   - Export to CSV/Excel

4. **User Authentication**
   - Login system
   - Save validation history

---

## Files Modified/Created in This Session

| File | Action |
|------|--------|
| `src/types/invoice.ts` | Created |
| `src/services/mockData.ts` | Created |
| `src/services/invoiceService.ts` | Created |
| `src/validation/rules.ts` | Created |
| `src/validation/llmAnalyzer.ts` | Created |
| `src/hooks/useInvoiceValidation.ts` | Created |
| `src/components/InvoiceForm.tsx` | Created |
| `src/components/InvoiceDisplay.tsx` | Created |
| `src/components/ValidationResults.tsx` | Created |
| `src/components/IssueFlag.tsx` | Created |
| `src/App.tsx` | Modified |
| `src/vite-env.d.ts` | Created |
| `.env` | Created (gitignored) |
| `.gitignore` | Modified (added .env) |
| `index.html` | Modified (title changed) |
| `package.json` | Modified (added @anthropic-ai/sdk) |

---

## Session Date
December 21, 2025
