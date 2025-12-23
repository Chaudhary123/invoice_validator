# Project Architecture

## Directory Structure

```
hooks/
├── .env                    # API keys (VITE_ANTHROPIC_API_KEY)
├── .gitignore
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── PROJECT_SUMMARY.md      # Documentation
│
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Main app component (orchestrates UI)
    ├── index.css           # Tailwind imports
    ├── Form.tsx            # Legacy/unused form
    ├── vite-env.d.ts       # Vite type declarations
    │
    ├── types/
    │   └── invoice.ts      # TypeScript interfaces (Invoice, LineItem, etc.)
    │
    ├── services/
    │   ├── mockData.ts     # Sample invoices (valid + buggy)
    │   └── invoiceService.ts # API abstraction layer
    │
    ├── validation/
    │   ├── rules.ts        # Rule-based validators
    │   └── llmAnalyzer.ts  # Claude AI integration
    │
    ├── hooks/
    │   └── useInvoiceValidation.ts # Custom hook (fetch + validate)
    │
    └── components/
        ├── InvoiceForm.tsx       # Search form UI
        ├── InvoiceDisplay.tsx    # Invoice details table
        ├── ValidationResults.tsx # Results with issue counts
        └── IssueFlag.tsx         # Individual error/warning badge
```

## Data Flow Architecture

```
┌─────────────────┐     ┌──────────────────────┐
│  InvoiceForm    │────▶│ useInvoiceValidation │
│  (User Input)   │     │     (Custom Hook)    │
└─────────────────┘     └──────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌───────────┐  ┌───────────┐  ┌─────────────┐
            │ invoiceService │  │ rules.ts │  │ llmAnalyzer │
            │  (Fetch)  │  │(Validate) │  │ (Claude AI) │
            └─────┬─────┘  └─────┬─────┘  └──────┬──────┘
                  │              │               │
                  ▼              ▼               ▼
            ┌─────────┐   ┌────────────┐  ┌─────────────┐
            │mockData │   │ Validation │  │ AI Insights │
            │(Invoices)│   │  Results   │  │             │
            └─────────┘   └────────────┘  └─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            ┌─────────────────┐         ┌──────────────────┐
            │ ValidationResults│         │  InvoiceDisplay  │
            │   (Left Panel)  │         │  (Right Panel)   │
            └─────────────────┘         └──────────────────┘
```

## Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| **Components** | UI presentation (React) |
| **Hooks** | State management & orchestration |
| **Services** | Data fetching (mock → real API later) |
| **Validation** | Rule-based + AI validation logic |
| **Types** | TypeScript interfaces |
