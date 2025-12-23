import type { Invoice, LineItem } from '../types/invoice';

// Odoo JSON-RPC client for invoice fetching
// Use proxy in development to avoid CORS issues
const ODOO_URL = import.meta.env.DEV ? '/odoo-api' : import.meta.env.VITE_ODOO_URL;
const ODOO_DB = import.meta.env.VITE_ODOO_DB;
const ODOO_USERNAME = import.meta.env.VITE_ODOO_USERNAME;
const ODOO_API_KEY = import.meta.env.VITE_ODOO_API_KEY;

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: 'call';
  params: {
    service: string;
    method: string;
    args: unknown[];
  };
  id: number;
}

interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data: {
      name: string;
      debug: string;
      message: string;
    };
  };
}

// Odoo invoice record structure
interface OdooInvoice {
  id: number;
  name: string; // Invoice number/ID
  partner_id: [number, string]; // [id, name] - Vendor/Customer
  invoice_date: string | false;
  amount_untaxed: number; // Subtotal
  amount_tax: number; // Tax amount
  amount_total: number; // Grand total
  invoice_line_ids: number[]; // Line item IDs
}

interface OdooInvoiceLine {
  id: number;
  name: string; // Description
  quantity: number;
  price_unit: number; // Unit price
  price_subtotal: number; // Line total
}

let cachedUid: number | null = null;

// Make JSON-RPC call to Odoo
async function jsonRpcCall<T>(service: string, method: string, args: unknown[]): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service,
      method,
      args,
    },
    id: Date.now(),
  };

  const response = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data: JsonRpcResponse<T> = await response.json();

  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message);
  }

  return data.result as T;
}

// Authenticate and get user ID
async function authenticate(): Promise<number> {
  if (cachedUid) {
    return cachedUid;
  }

  const uid = await jsonRpcCall<number>('common', 'authenticate', [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_API_KEY,
    {},
  ]);

  if (!uid) {
    throw new Error('Odoo authentication failed. Check your credentials.');
  }

  cachedUid = uid;
  return uid;
}

// Execute Odoo model method
async function executeKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const uid = await authenticate();

  return jsonRpcCall<T>('object', 'execute_kw', [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
}

// Search for invoice by name/number
async function searchInvoice(invoiceId: string): Promise<number[]> {
  return executeKw<number[]>(
    'account.move',
    'search',
    [[['name', 'ilike', invoiceId], ['move_type', 'in', ['out_invoice', 'in_invoice']]]],
    { limit: 1 }
  );
}

// Read invoice details
async function readInvoice(ids: number[]): Promise<OdooInvoice[]> {
  return executeKw<OdooInvoice[]>(
    'account.move',
    'read',
    [ids],
    {
      fields: [
        'name',
        'partner_id',
        'invoice_date',
        'amount_untaxed',
        'amount_tax',
        'amount_total',
        'invoice_line_ids',
      ],
    }
  );
}

// Read invoice line items
async function readInvoiceLines(ids: number[]): Promise<OdooInvoiceLine[]> {
  return executeKw<OdooInvoiceLine[]>(
    'account.move.line',
    'read',
    [ids],
    {
      fields: ['name', 'quantity', 'price_unit', 'price_subtotal'],
    }
  );
}

// Transform Odoo data to our Invoice format
function transformToInvoice(
  odooInvoice: OdooInvoice,
  odooLines: OdooInvoiceLine[]
): Invoice {
  // Filter out non-product lines (like tax lines, payment terms, etc.)
  const productLines = odooLines.filter(
    (line) => line.quantity > 0 && line.price_unit > 0
  );

  const lineItems: LineItem[] = productLines.map((line, index) => ({
    id: `L${index + 1}`,
    description: line.name || 'Item',
    quantity: line.quantity,
    unitPrice: line.price_unit,
    lineTotal: line.price_subtotal,
  }));

  // Calculate tax rate from amounts
  const subtotal = odooInvoice.amount_untaxed;
  const taxAmount = odooInvoice.amount_tax;
  const taxRate = subtotal > 0 ? taxAmount / subtotal : 0;

  return {
    id: odooInvoice.name,
    organization: 'odoo',
    vendor: odooInvoice.partner_id ? odooInvoice.partner_id[1] : 'Unknown Vendor',
    date: odooInvoice.invoice_date || new Date().toISOString().split('T')[0],
    lineItems,
    subtotal,
    taxRate: Math.round(taxRate * 10000) / 10000, // Round to 4 decimal places
    taxAmount,
    discounts: 0, // Odoo handles discounts differently, would need additional fields
    grandTotal: odooInvoice.amount_total,
  };
}

// Main function to fetch invoice from Odoo
export async function fetchOdooInvoice(invoiceId: string): Promise<Invoice> {
  // Search for the invoice
  const invoiceIds = await searchInvoice(invoiceId);

  if (invoiceIds.length === 0) {
    throw new Error(`Invoice "${invoiceId}" not found in Odoo`);
  }

  // Read invoice details
  const invoices = await readInvoice(invoiceIds);

  if (invoices.length === 0) {
    throw new Error(`Could not read invoice "${invoiceId}" from Odoo`);
  }

  const odooInvoice = invoices[0];

  // Read line items
  let odooLines: OdooInvoiceLine[] = [];
  if (odooInvoice.invoice_line_ids && odooInvoice.invoice_line_ids.length > 0) {
    odooLines = await readInvoiceLines(odooInvoice.invoice_line_ids);
  }

  // Transform to our format
  return transformToInvoice(odooInvoice, odooLines);
}

// Test connection to Odoo
export async function testOdooConnection(): Promise<boolean> {
  try {
    await authenticate();
    return true;
  } catch {
    return false;
  }
}
