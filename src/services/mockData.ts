import type { Invoice } from '../types/invoice';

// QuickBook mock invoices
export const quickBookInvoices: Invoice[] = [
  {
    id: 'QB-INV-001',
    organization: 'quickBook',
    vendor: 'Acme Corporation',
    date: '2024-12-15',
    lineItems: [
      { id: 'L1', description: 'Widget A - Standard', quantity: 10, unitPrice: 25.00, lineTotal: 250.00 },
      { id: 'L2', description: 'Widget B - Premium', quantity: 5, unitPrice: 50.00, lineTotal: 250.00 },
      { id: 'L3', description: 'Shipping & Handling', quantity: 1, unitPrice: 15.00, lineTotal: 15.00 },
    ],
    subtotal: 515.00,
    taxRate: 0.08,
    taxAmount: 41.20,
    discounts: 0,
    grandTotal: 556.20,
  },
  {
    // Invoice with calculation bug: lineTotal is wrong
    id: 'QB-INV-002',
    organization: 'quickBook',
    vendor: 'Tech Solutions Ltd',
    date: '2024-12-18',
    lineItems: [
      { id: 'L1', description: 'Consulting Services', quantity: 3, unitPrice: 100.00, lineTotal: 290.00 }, // BUG: should be 300
      { id: 'L2', description: 'Software License', quantity: 2, unitPrice: 150.00, lineTotal: 300.00 },
    ],
    subtotal: 590.00, // Cascading error from wrong lineTotal
    taxRate: 0.10,
    taxAmount: 59.00,
    discounts: 50.00,
    grandTotal: 599.00,
  },
  {
    // Invoice with tax calculation bug
    id: 'QB-INV-003',
    organization: 'quickBook',
    vendor: 'Office Supplies Inc',
    date: '2024-12-20',
    lineItems: [
      { id: 'L1', description: 'Printer Paper (Box)', quantity: 10, unitPrice: 35.00, lineTotal: 350.00 },
      { id: 'L2', description: 'Ink Cartridges', quantity: 4, unitPrice: 45.00, lineTotal: 180.00 },
    ],
    subtotal: 530.00,
    taxRate: 0.07,
    taxAmount: 40.00, // BUG: should be 37.10
    discounts: 20.00,
    grandTotal: 550.00, // Also wrong due to tax error
  },
];

// Salesforce mock invoices
export const salesForceInvoices: Invoice[] = [
  {
    id: 'SF-INV-001',
    organization: 'salesForce',
    vendor: 'Global Marketing Agency',
    date: '2024-12-10',
    lineItems: [
      { id: 'L1', description: 'Digital Marketing Campaign', quantity: 1, unitPrice: 2500.00, lineTotal: 2500.00 },
      { id: 'L2', description: 'Social Media Management', quantity: 3, unitPrice: 500.00, lineTotal: 1500.00 },
      { id: 'L3', description: 'Content Creation', quantity: 10, unitPrice: 75.00, lineTotal: 750.00 },
    ],
    subtotal: 4750.00,
    taxRate: 0.085,
    taxAmount: 403.75,
    discounts: 250.00,
    grandTotal: 4903.75,
  },
  {
    // Invoice with subtotal calculation bug
    id: 'SF-INV-002',
    organization: 'salesForce',
    vendor: 'Cloud Services Pro',
    date: '2024-12-12',
    lineItems: [
      { id: 'L1', description: 'Cloud Hosting (Annual)', quantity: 1, unitPrice: 1200.00, lineTotal: 1200.00 },
      { id: 'L2', description: 'SSL Certificate', quantity: 2, unitPrice: 100.00, lineTotal: 200.00 },
      { id: 'L3', description: 'Technical Support', quantity: 12, unitPrice: 50.00, lineTotal: 600.00 },
    ],
    subtotal: 1900.00, // BUG: should be 2000 (1200 + 200 + 600)
    taxRate: 0.06,
    taxAmount: 114.00, // Also wrong due to subtotal error
    discounts: 0,
    grandTotal: 2014.00, // Also wrong
  },
  {
    // Invoice with grand total calculation bug
    id: 'SF-INV-003',
    organization: 'salesForce',
    vendor: 'Enterprise Solutions',
    date: '2024-12-19',
    lineItems: [
      { id: 'L1', description: 'Enterprise License', quantity: 5, unitPrice: 300.00, lineTotal: 1500.00 },
      { id: 'L2', description: 'Training Sessions', quantity: 2, unitPrice: 250.00, lineTotal: 500.00 },
    ],
    subtotal: 2000.00,
    taxRate: 0.09,
    taxAmount: 180.00,
    discounts: 100.00,
    grandTotal: 2100.00, // BUG: should be 2080 (2000 + 180 - 100)
  },
  {
    // Valid invoice
    id: 'SF-INV-004',
    organization: 'salesForce',
    vendor: 'Data Analytics Corp',
    date: '2024-12-21',
    lineItems: [
      { id: 'L1', description: 'Data Analysis Package', quantity: 1, unitPrice: 800.00, lineTotal: 800.00 },
      { id: 'L2', description: 'Report Generation', quantity: 5, unitPrice: 40.00, lineTotal: 200.00 },
    ],
    subtotal: 1000.00,
    taxRate: 0.05,
    taxAmount: 50.00,
    discounts: 0,
    grandTotal: 1050.00,
  },
];

// Get all mock invoices
export const getAllMockInvoices = (): Invoice[] => {
  return [...quickBookInvoices, ...salesForceInvoices];
};

// Find invoice by ID and organization
export const findMockInvoice = (
  invoiceId: string,
  organization: 'quickBook' | 'salesForce'
): Invoice | undefined => {
  const invoices = organization === 'quickBook' ? quickBookInvoices : salesForceInvoices;
  return invoices.find((inv) => inv.id.toLowerCase() === invoiceId.toLowerCase());
};
