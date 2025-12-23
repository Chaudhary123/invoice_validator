# Invoice Validation Tool - Project Summary

## Overview
A React + TypeScript application that fetches invoices from QuickBook, Salesforce, or Odoo and validates them for calculation errors using rule-based logic and Claude AI analysis.

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
│   └── invoice.ts              # TypeScript interfaces + Organization config
├── services/
│   ├── mockData.ts             # Sample invoices (valid + buggy)
│   ├── invoiceService.ts       # API abstraction layer (factory pattern)
│   └── odooApi.ts              # Real Odoo JSON-RPC API client
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
- Supports **QuickBook**, **Salesforce**, and **Odoo** organizations
- Abstract service layer using Strategy + Factory patterns
- Mock data for testing + real API integration for Odoo
- Simulated network delay (800ms) for mock data

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

## Centralized Organization Configuration

All organization settings are defined in **one place**: `src/types/invoice.ts`

```typescript
export const ORGANIZATIONS: Record<OrganizationType, OrganizationConfig> = {
  quickBook: {
    key: 'quickBook',
    displayName: 'QuickBook',
    sampleInvoiceIds: ['QB-INV-001', 'QB-INV-002', 'QB-INV-003'],
    badgeClasses: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  salesForce: {
    key: 'salesForce',
    displayName: 'Salesforce',
    sampleInvoiceIds: ['SF-INV-001', 'SF-INV-002', 'SF-INV-003', 'SF-INV-004'],
    badgeClasses: 'bg-sky-50 text-sky-700 border border-sky-200',
  },
  odoo: {
    key: 'odoo',
    displayName: 'Odoo',
    sampleInvoiceIds: ['ODO-INV-001', 'ODO-INV-002', 'ODO-INV-003', 'ODO-INV-004'],
    badgeClasses: 'bg-purple-50 text-purple-700 border border-purple-200',
  },
};
```

### Adding a New Organization

1. Add entry to `ORGANIZATIONS` in `src/types/invoice.ts`
2. Update `OrganizationType` union type
3. Add mock data in `src/services/mockData.ts`
4. Create service class in `src/services/invoiceService.ts`
5. Update `getInvoiceService()` factory function

The UI components automatically pick up changes from the central config.

---

## Odoo API Integration

### Architecture
```
Browser → localhost:5173/odoo-api/jsonrpc → Vite Proxy → odoo.com/jsonrpc
```

### Files Involved
| File | Purpose |
|------|---------|
| `src/services/odooApi.ts` | JSON-RPC client for Odoo API |
| `src/services/invoiceService.ts` | OdooService class using the API |
| `vite.config.ts` | CORS proxy configuration |

### How It Works
1. `OdooService.fetchInvoice()` checks if invoice ID starts with `ODO-INV-` (mock) or is real
2. For real invoices, calls `fetchOdooInvoice()` from `odooApi.ts`
3. API uses JSON-RPC to authenticate and fetch from `account.move` model
4. Invoice data is transformed to match our `Invoice` interface

### CORS Proxy (Development)
Vite proxy in `vite.config.ts` routes `/odoo-api/*` to the Odoo server:

```typescript
server: {
  proxy: {
    '/odoo-api': {
      target: 'https://techforyou.odoo.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/odoo-api/, ''),
      secure: true,
    },
  },
},
```

---

## Test Invoices Available

### QuickBook (Mock)
| ID | Status | Bug |
|----|--------|-----|
| QB-INV-001 | Valid | None |
| QB-INV-002 | Invalid | Line item total wrong (290 instead of 300) |
| QB-INV-003 | Invalid | Tax calculation wrong (40 instead of 37.10) |

### Salesforce (Mock)
| ID | Status | Bug |
|----|--------|-----|
| SF-INV-001 | Valid | None |
| SF-INV-002 | Invalid | Subtotal wrong (1900 instead of 2000) |
| SF-INV-003 | Invalid | Grand total wrong (2100 instead of 2080) |
| SF-INV-004 | Valid | None |

### Odoo (Mock + Real)
| ID | Status | Bug |
|----|--------|-----|
| ODO-INV-001 | Valid | None |
| ODO-INV-002 | Invalid | Line item total wrong (2900 instead of 3000) |
| ODO-INV-003 | Invalid | Tax calculation wrong (200 instead of 195) |
| ODO-INV-004 | Valid | None |
| *Real Invoice IDs* | - | Fetched from Odoo API |

---

## Environment Setup

### .env file (create in project root)
```bash
# Claude AI
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Odoo Configuration
VITE_ODOO_URL=https://yourcompany.odoo.com
VITE_ODOO_DB=your_database_name
VITE_ODOO_USERNAME=your_email@example.com
VITE_ODOO_API_KEY=your_odoo_api_key
```

**Note:** The `.env` file is gitignored for security.

### Getting Odoo API Key
1. Log into your Odoo instance
2. Go to Settings → Users & Companies → Users
3. Select your user → Preferences tab
4. Under "Account Security", generate an API Key

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

## Data Flow Architecture

```
┌─────────────────┐     ┌──────────────────────┐
│  InvoiceForm    │────▶│ useInvoiceValidation │
│  (User Input)   │     │     (Custom Hook)    │
└─────────────────┘     └──────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌─────────────┐  ┌───────────┐  ┌─────────────┐
            │invoiceService│  │ rules.ts  │  │ llmAnalyzer │
            │  (Factory)  │  │(Validate) │  │ (Claude AI) │
            └──────┬──────┘  └─────┬─────┘  └──────┬──────┘
                   │               │               │
         ┌─────────┼─────────┐     │               │
         ▼         ▼         ▼     ▼               ▼
    ┌─────────┐┌─────────┐┌─────────┐ ┌────────────┐┌─────────────┐
    │QuickBook││Salesforce││  Odoo   │ │ Validation ││ AI Insights │
    │ Service ││ Service  ││ Service │ │  Results   ││             │
    └────┬────┘└────┬─────┘└────┬────┘ └────────────┘└─────────────┘
         │          │           │
         ▼          ▼           ▼
    ┌─────────┐┌─────────┐┌─────────┐
    │MockData ││MockData ││OdooAPI  │
    │         ││         ││(Real)   │
    └─────────┘└─────────┘└─────────┘
```

---

## Git Repository

- **Remote:** https://github.com/Chaudhary123/invoice_validator.git
- **Branch:** master

---

## Future Enhancements

1. **Real API Integration for QuickBook/Salesforce**
   - Replace mock services with actual APIs
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

5. **Production CORS Solution**
   - Backend proxy server for Odoo API calls
   - Or serverless functions (Vercel/Netlify)

---

## Files Modified/Created

| File | Action | Description |
|------|--------|-------------|
| `src/types/invoice.ts` | Modified | Added ORGANIZATIONS config, OrganizationConfig interface |
| `src/services/mockData.ts` | Modified | Added Odoo mock invoices |
| `src/services/invoiceService.ts` | Modified | Added OdooService class |
| `src/services/odooApi.ts` | Created | Odoo JSON-RPC API client |
| `src/components/InvoiceForm.tsx` | Modified | Uses central config |
| `src/components/InvoiceDisplay.tsx` | Modified | Uses central config, fixed Odoo badge bug |
| `src/App.tsx` | Modified | Uses central config for description |
| `src/vite-env.d.ts` | Modified | Added Odoo env types |
| `vite.config.ts` | Modified | Added CORS proxy for Odoo |
| `.env` | Modified | Added Odoo credentials |
| `ARCHITECTURE.md` | Created | Architecture documentation |

---

## Session Dates
- December 21, 2025 - Initial implementation
- December 23, 2025 - Added Odoo support, real API integration, centralized config
