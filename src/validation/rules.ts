import type { Invoice, ValidationIssue, ValidationResult } from '../types/invoice';

// Tolerance for floating point comparison (to handle rounding)
const EPSILON = 0.01;

function isEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

// Rule 1: Validate line item totals (quantity × unitPrice = lineTotal)
export function validateLineItems(invoice: Invoice): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  invoice.lineItems.forEach((item, index) => {
    const expectedTotal = roundToTwo(item.quantity * item.unitPrice);

    if (!isEqual(item.lineTotal, expectedTotal)) {
      issues.push({
        field: `lineItems[${index}].lineTotal`,
        message: `Line item "${item.description}": quantity (${item.quantity}) × unit price ($${item.unitPrice}) should equal $${expectedTotal}, but got $${item.lineTotal}`,
        expected: expectedTotal,
        actual: item.lineTotal,
        severity: 'error',
      });
    }
  });

  return issues;
}

// Rule 2: Validate subtotal (sum of all lineTotals = subtotal)
export function validateSubtotal(invoice: Invoice): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const calculatedSubtotal = roundToTwo(
    invoice.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  );

  if (!isEqual(invoice.subtotal, calculatedSubtotal)) {
    issues.push({
      field: 'subtotal',
      message: `Subtotal should be sum of line items ($${calculatedSubtotal}), but got $${invoice.subtotal}`,
      expected: calculatedSubtotal,
      actual: invoice.subtotal,
      severity: 'error',
    });
  }

  return issues;
}

// Rule 3: Validate tax calculation (subtotal × taxRate = taxAmount)
export function validateTax(invoice: Invoice): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const expectedTax = roundToTwo(invoice.subtotal * invoice.taxRate);

  if (!isEqual(invoice.taxAmount, expectedTax)) {
    issues.push({
      field: 'taxAmount',
      message: `Tax amount should be subtotal ($${invoice.subtotal}) × tax rate (${(invoice.taxRate * 100).toFixed(1)}%) = $${expectedTax}, but got $${invoice.taxAmount}`,
      expected: expectedTax,
      actual: invoice.taxAmount,
      severity: 'error',
    });
  }

  // Warning for unusual tax rates
  if (invoice.taxRate > 0.25) {
    issues.push({
      field: 'taxRate',
      message: `Tax rate of ${(invoice.taxRate * 100).toFixed(1)}% seems unusually high`,
      expected: 0.25,
      actual: invoice.taxRate,
      severity: 'warning',
    });
  }

  if (invoice.taxRate < 0) {
    issues.push({
      field: 'taxRate',
      message: `Tax rate cannot be negative`,
      expected: 0,
      actual: invoice.taxRate,
      severity: 'error',
    });
  }

  return issues;
}

// Rule 4: Validate grand total (subtotal + taxAmount - discounts = grandTotal)
export function validateGrandTotal(invoice: Invoice): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const expectedGrandTotal = roundToTwo(
    invoice.subtotal + invoice.taxAmount - invoice.discounts
  );

  if (!isEqual(invoice.grandTotal, expectedGrandTotal)) {
    issues.push({
      field: 'grandTotal',
      message: `Grand total should be subtotal ($${invoice.subtotal}) + tax ($${invoice.taxAmount}) - discounts ($${invoice.discounts}) = $${expectedGrandTotal}, but got $${invoice.grandTotal}`,
      expected: expectedGrandTotal,
      actual: invoice.grandTotal,
      severity: 'error',
    });
  }

  return issues;
}

// Additional checks for unusual patterns
export function validateUnusualPatterns(invoice: Invoice): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for negative quantities
  invoice.lineItems.forEach((item, index) => {
    if (item.quantity < 0) {
      issues.push({
        field: `lineItems[${index}].quantity`,
        message: `Line item "${item.description}" has negative quantity (${item.quantity})`,
        expected: 0,
        actual: item.quantity,
        severity: 'warning',
      });
    }

    if (item.unitPrice <= 0) {
      issues.push({
        field: `lineItems[${index}].unitPrice`,
        message: `Line item "${item.description}" has zero or negative unit price ($${item.unitPrice})`,
        expected: 0.01,
        actual: item.unitPrice,
        severity: 'warning',
      });
    }
  });

  // Check for negative discounts (which would add to total)
  if (invoice.discounts < 0) {
    issues.push({
      field: 'discounts',
      message: `Discounts should not be negative ($${invoice.discounts})`,
      expected: 0,
      actual: invoice.discounts,
      severity: 'warning',
    });
  }

  // Check if discount exceeds subtotal
  if (invoice.discounts > invoice.subtotal) {
    issues.push({
      field: 'discounts',
      message: `Discount ($${invoice.discounts}) exceeds subtotal ($${invoice.subtotal})`,
      expected: invoice.subtotal,
      actual: invoice.discounts,
      severity: 'warning',
    });
  }

  return issues;
}

// Run all validations
export function validateAll(invoice: Invoice): ValidationResult {
  const allIssues: ValidationIssue[] = [
    ...validateLineItems(invoice),
    ...validateSubtotal(invoice),
    ...validateTax(invoice),
    ...validateGrandTotal(invoice),
    ...validateUnusualPatterns(invoice),
  ];

  return {
    isValid: allIssues.filter((i) => i.severity === 'error').length === 0,
    issues: allIssues,
  };
}
