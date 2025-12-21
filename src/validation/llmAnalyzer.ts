import Anthropic from '@anthropic-ai/sdk';
import type { Invoice, ValidationResult, ValidationIssue } from '../types/invoice';

// Initialize Anthropic client
const getAnthropicClient = (): Anthropic | null => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('VITE_ANTHROPIC_API_KEY not set. LLM analysis will be skipped.');
    return null;
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for browser-side usage
  });
};

// System prompt defining the AI's analysis rules
const SYSTEM_PROMPT = `You are an expert invoice auditor AI. Analyze the provided invoice data and check for:

1. **Mathematical Accuracy**: Verify all calculations are correct
   - Line item totals: quantity × unit_price = line_total
   - Subtotal: sum of all line_totals
   - Tax: subtotal × tax_rate = tax_amount
   - Grand total: subtotal + tax - discounts

2. **Rounding Inconsistencies**: Flag if numbers seem to be rounded differently

3. **Missing or Duplicate Items**: Check for potential data issues

4. **Unusual Patterns**: Flag concerning patterns like:
   - Negative quantities or prices
   - Zero-value items
   - Tax rates above 25% or negative
   - Discounts exceeding the subtotal

5. **Data Integrity**: Check for any inconsistencies in the data

Respond in a structured format with:
- A brief summary of your findings
- List any issues found with severity (ERROR or WARNING)
- Provide recommendations if issues are found

Be concise but thorough. Focus on actionable insights.`;

// Format invoice data for the LLM
function formatInvoiceForLLM(invoice: Invoice): string {
  const lineItemsStr = invoice.lineItems
    .map(
      (item, i) =>
        `  ${i + 1}. ${item.description}: qty=${item.quantity}, price=$${item.unitPrice}, total=$${item.lineTotal}`
    )
    .join('\n');

  return `
INVOICE DETAILS:
================
Invoice ID: ${invoice.id}
Organization: ${invoice.organization}
Vendor: ${invoice.vendor}
Date: ${invoice.date}

LINE ITEMS:
${lineItemsStr}

CALCULATIONS:
- Subtotal: $${invoice.subtotal}
- Tax Rate: ${(invoice.taxRate * 100).toFixed(2)}%
- Tax Amount: $${invoice.taxAmount}
- Discounts: $${invoice.discounts}
- Grand Total: $${invoice.grandTotal}
`;
}

// Analyze invoice using Claude LLM
export async function analyzeWithLLM(invoice: Invoice): Promise<string | null> {
  const client = getAnthropicClient();

  if (!client) {
    return null;
  }

  try {
    const invoiceData = formatInvoiceForLLM(invoice);

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please analyze this invoice for any calculation errors or issues:\n${invoiceData}`,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === 'text');
    return textContent ? textContent.text : null;
  } catch (error) {
    console.error('LLM analysis failed:', error);
    return null;
  }
}

// Parse LLM response to extract additional issues (optional enhancement)
export function parseLLMResponse(llmResponse: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Simple pattern matching for ERROR mentions
  const errorPattern = /ERROR[:\s]+(.+?)(?:\n|$)/gi;
  let match;

  while ((match = errorPattern.exec(llmResponse)) !== null) {
    issues.push({
      field: 'llm_detected',
      message: match[1].trim(),
      expected: 0,
      actual: 0,
      severity: 'error',
    });
  }

  // Pattern matching for WARNING mentions
  const warningPattern = /WARNING[:\s]+(.+?)(?:\n|$)/gi;

  while ((match = warningPattern.exec(llmResponse)) !== null) {
    issues.push({
      field: 'llm_detected',
      message: match[1].trim(),
      expected: 0,
      actual: 0,
      severity: 'warning',
    });
  }

  return issues;
}

// Combined analysis: rule-based + LLM
export async function performFullAnalysis(
  invoice: Invoice,
  ruleBasedResult: ValidationResult
): Promise<ValidationResult> {
  // Get LLM analysis
  const llmAnalysis = await analyzeWithLLM(invoice);

  // If LLM analysis succeeded, add it to the result
  if (llmAnalysis) {
    // Optionally parse LLM response for additional issues
    const llmIssues = parseLLMResponse(llmAnalysis);

    return {
      ...ruleBasedResult,
      issues: [...ruleBasedResult.issues, ...llmIssues],
      llmAnalysis,
    };
  }

  return ruleBasedResult;
}
