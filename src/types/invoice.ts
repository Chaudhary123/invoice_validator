export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number; // Should equal quantity × unitPrice
}

export interface Invoice {
  id: string;
  organization: 'quickBook' | 'salesForce';
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

export type OrganizationType = 'quickBook' | 'salesForce';
