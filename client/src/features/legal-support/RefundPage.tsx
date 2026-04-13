import { LegalPageLayout } from './LegalPageLayout'

export default function RefundPage() {
  return (
    <LegalPageLayout 
      title="Refund Policy" 
      lastUpdated="April 13, 2026"
      metaDescription="Check the CareerForge Refund Policy to see if you are eligible for a refund on your subscription."
    >
      <p>CareerForge offers subscription-based access to AI-powered career tools. We strive to provide a high-quality service, but we understand that circumstances vary.</p>
      
      <hr />

      <h3>Refund Eligibility</h3>
      <p>Refunds are only applicable if <strong>no credits or features have been used</strong> after the payment was processed.</p>
      <p>Because our AI features incur direct costs for generation, once any credits are used or any feature (like JD Tailoring or Resume Building) is accessed in a billing period, the purchase is considered consumed and is <strong>non-refundable</strong>.</p>

      <hr />

      <h3>Exceptions (Refund Allowed)</h3>
      <p>We will issue refunds regardless of usage in the following specific cases:</p>
      <ul>
        <li>Duplicate or accidental direct charges for the same billing period</li>
        <li>Documented technical errors that prevented you from accessing the service after payment</li>
        <li>Unauthorized fraudulent transactions (subject to bank verification)</li>
      </ul>

      <hr />

      <h3>Non-Refundable Cases</h3>
      <p>Refunds will not be granted in the following scenarios:</p>
      <ul>
        <li>Any usage of credits (even if only one generation was performed)</li>
        <li>Dissatisfaction with the specific AI-generated suggestions or results</li>
        <li>Requests made more than 7 days after the transaction date</li>
        <li>Forgot to cancel a subscription before the renewal date (though you can cancel for the next cycle)</li>
      </ul>

      <hr />

      <h3>Cancellations</h3>
      <p>You may cancel your subscription at any time through your dashboard. Your access will continue until the end of the current billing period, and no further charges will apply once cancelled.</p>

      <hr />

      <h3>How to Request a Refund</h3>
      <p>If you believe you are eligible for a refund, please email <a href="mailto:support@careerforge.pro">support@careerforge.pro</a> with the following details:</p>
      <ul>
        <li>Your registered email address</li>
        <li>Date and amount of the charge</li>
        <li>Reason for the refund request</li>
      </ul>
      <p>We typically respond to all refund requests within 3 business days.</p>

      <hr />

      <p><strong>Contact:</strong> <a href="mailto:support@careerforge.pro">support@careerforge.pro</a></p>
    </LegalPageLayout>
  )
}
