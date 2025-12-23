export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number; // Should equal quantity × unitPrice
}

export interface Invoice {
  id: string;
  organization: 'quickBook' | 'salesForce' | 'odoo';
  vendor: string;
  date: string;
  lineItems: LineItem[];
  subtotal: number;      // Sum of all lineTotals
  taxRate: number;       // e.g., 0.08 for 8%
  taxAmount: number;     // subtotal × taxRate
  discounts: number;
  grandTotal: number;    // subtotal + taxAmount - discounts
}

export interface ValidationIssue {
  field: string;
  message: string;
  expected: number;
  actual: number;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  llmAnalysis?: string; // AI insights for complex cases
}

export type OrganizationType = 'quickBook' | 'salesForce' | 'odoo';

// Centralized organization configuration
export interface OrganizationConfig {
  key: OrganizationType;
  displayName: string;
  sampleInvoiceIds: string[];
  badgeClasses: string;
}

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

// Helper to get all organization keys
export const ORGANIZATION_KEYS = Object.keys(ORGANIZATIONS) as OrganizationType[];
