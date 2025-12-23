import type { Invoice, OrganizationType } from '../types/invoice';
import { findMockInvoice } from './mockData';
import { fetchOdooInvoice } from './odooApi';

// Abstract interface for invoice service
export interface IInvoiceService {
  fetchInvoice(invoiceId: string): Promise<Invoice>;
}

// QuickBook Service Implementation
export class QuickBookService implements IInvoiceService {
  async fetchInvoice(invoiceId: string): Promise<Invoice> {
    // Simulate API delay
    await this.simulateNetworkDelay();

    const invoice = findMockInvoice(invoiceId, 'quickBook');

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found in QuickBook`);
    }

    return invoice;
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 800));
  }

  // Future: Real API implementation
  // async fetchInvoiceFromAPI(invoiceId: string): Promise<Invoice> {
  //   const response = await fetch(`https://api.quickbooks.com/invoices/${invoiceId}`, {
  //     headers: { Authorization: `Bearer ${process.env.QUICKBOOK_API_KEY}` }
  //   });
  //   return response.json();
  // }
}

// Salesforce Service Implementation
export class SalesforceService implements IInvoiceService {
  async fetchInvoice(invoiceId: string): Promise<Invoice> {
    // Simulate API delay
    await this.simulateNetworkDelay();

    const invoice = findMockInvoice(invoiceId, 'salesForce');

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found in Salesforce`);
    }

    return invoice;
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 800));
  }

  // Future: Real API implementation with OAuth
  // async fetchInvoiceFromAPI(invoiceId: string): Promise<Invoice> {
  //   const response = await fetch(`https://api.salesforce.com/invoices/${invoiceId}`, {
  //     headers: { Authorization: `Bearer ${await this.getOAuthToken()}` }
  //   });
  //   return response.json();
  // }
}

// Odoo Service Implementation - Uses real Odoo API
export class OdooService implements IInvoiceService {
  async fetchInvoice(invoiceId: string): Promise<Invoice> {
    // Check if it's a mock invoice ID (for testing)
    if (invoiceId.toUpperCase().startsWith('ODO-INV-')) {
      const mockInvoice = findMockInvoice(invoiceId, 'odoo');
      if (mockInvoice) {
        // Simulate network delay for mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        return mockInvoice;
      }
    }

    // Fetch from real Odoo API
    return fetchOdooInvoice(invoiceId);
  }
}

// Factory function to get the correct service based on organization
export function getInvoiceService(organization: OrganizationType): IInvoiceService {
  switch (organization) {
    case 'quickBook':
      return new QuickBookService();
    case 'salesForce':
      return new SalesforceService();
    case 'odoo':
      return new OdooService();
    default:
      throw new Error(`Unknown organization: ${organization}`);
  }
}

// Convenience function to fetch invoice
export async function fetchInvoice(
  invoiceId: string,
  organization: OrganizationType
): Promise<Invoice> {
  const service = getInvoiceService(organization);
  return service.fetchInvoice(invoiceId);
}
