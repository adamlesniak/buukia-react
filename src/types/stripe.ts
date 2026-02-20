import type { CVCCheckStatus } from "./payment";

export interface StripePagination<T> {
  object: "list";
  url: string;
  has_more: boolean;
  data: T[];
}

export interface StripeBankAccount {
  id: string;
  object: "bank_account";
  account_holder_name: string;
  account_holder_type: string;
  bank_name: string;
  country: string;
  currency: string;
  customer: string;
  fingerprint: string;
  last4: string;
  metadata: object;
  routing_number: string;
  status: string;
}

export interface StripeRefund {
  id: string;
  object: "refund";
  amount: number;
  balance_transaction: string;
  charge: string;
  created: number;
  currency: string;
  destination_details: {
    card: {
      reference: string;
      reference_status: string;
      reference_type: string;
      type: string;
    };
    type: string;
  };
  metadata: object;
  payment_intent: string | null;
  reason: StripeRefundReason;
  receipt_number: string;
  source_transfer_reversal: string;
  status: string;
  transfer_reversal: string;
}

export interface StripeCharge {
  id: string;
  object: "charge";
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application: null;
  application_fee: null;
  application_fee_amount: null;
  balance_transaction: string;
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    email: string;
    name: string;
    phone: string;
  };
  calculated_statement_descriptor: string;
  captured: boolean;
  created: number;
  currency: string;
  customer: null;
  description: string;
  disputed: boolean;
  dispute?: StripeDispute;
  failure_balance_transaction: null;
  failure_code: null;
  failure_message: null;
  fraud_details: object;
  livemode: boolean;
  metadata: object;
  on_behalf_of: null;
  outcome: {
    network_status: string;
    reason: null;
    risk_level: string;
    risk_score: number;
    seller_message: string;
    type: string;
  };
  paid: boolean;
  payment_intent: null;
  payment_method: string;
  payment_method_details: {
    card: {
      brand: string;
      checks: {
        address_line1_check: CVCCheckStatus;
        address_postal_code_check: CVCCheckStatus;
        cvc_check: CVCCheckStatus;
      };
      country: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      funding: string;
      installments: null;
      last4: string;
      mandate: null;
      network: string;
      three_d_secure: null;
      wallet: null;
    };
    type: "card";
  };
  receipt_email: null;
  receipt_number: null;
  receipt_url: string;
  refunds?: {
    object: "list";
    data: StripeRefund[];
    has_more: boolean;
    url: string;
  };
  refunded: boolean;
  review: null;
  shipping: null;
  source_transfer: null;
  statement_descriptor: null;
  statement_descriptor_suffix: null;
  status: string;
  transfer_data: null;
  transfer_group: null;
}

export interface StripeBalanceTransaction {
  id: string;
  object: "balance_transaction";
  amount: number;
  available_on: number;
  balance_type: string;
  created: number;
  currency: string;
  description: string;
  exchange_rate: null;
  fee: number;
  fee_details: Array<{
    amount: number;
    application: null;
    currency: string;
    description: string;
    type: string;
  }>;
  net: number;
  reporting_category: string;
  source: string;
  status: string;
  type: string;
}

export enum StripeDisputeReason {
  General = "general",
  Chargeback = "chargeback",
  Refund = "refund",
  Duplicate = "duplicate",
  Fraudulent = "fraudulent",
  SubscriptionCanceled = "subscription_canceled",
  ProductUnacceptable = "product_unacceptable",
  ProductNotReceived = "product_not_received",
  Unrecognized = "unrecognized",
  CreditNotProcessed = "credit_not_processed",
  CustomerInitiated = "customer_initiated",
}

export enum StripeDisputeStatus {
  WarningNeedsResponse = "warning_needs_response",
  WarningUnderReview = "warning_under_review",
  WarningClosed = "warning_closed",
  NeedsResponse = "needs_response",
  UnderReview = "under_review",
  Won = "won",
  Lost = "lost",
}

export enum StripeRefundReason {
  Duplicate = "duplicate",
  Fraudulent = "fraudulent",
  RequestedByCustomer = "requested_by_customer",
}

export enum StripeAccountHolderType {
  Company = "company",
  Individual = "individual",
}

export interface StripeDispute {
  id: string;
  object: "dispute";
  amount: number;
  balance_transactions: StripeBalanceTransaction[];
  charge: string;
  created: number;
  currency: string;
  evidence: {
    access_activity_log: null;
    billing_address: null;
    cancellation_policy: null;
    cancellation_policy_disclosure: null;
    cancellation_rebuttal: null;
    customer_communication: null;
    customer_email_address: null;
    customer_name: null;
    customer_purchase_ip: null;
    customer_signature: null;
    duplicate_charge_documentation: null;
    duplicate_charge_explanation: null;
    duplicate_charge_id: null;
    product_description: null;
    receipt: null;
    refund_policy: null;
    refund_policy_disclosure: null;
    refund_refusal_explanation: null;
    service_date: null;
    service_documentation: null;
    shipping_address: null;
    shipping_carrier: null;
    shipping_date: null;
    shipping_documentation: null;
    shipping_tracking_number: null;
    uncategorized_file: null;
    uncategorized_text: null;
  };
  evidence_details: {
    due_by: number;
    has_evidence: boolean;
    past_due: boolean;
    submission_count: number;
  };
  network_reason_code: string;
  is_charge_refundable: boolean;
  livemode: boolean;
  metadata: object;
  payment_intent: null;
  reason: StripeDisputeReason;
  status: StripeDisputeStatus;
}

export interface StripePayout {
  id: string;
  object: "payout";
  amount: number;
  arrival_date: number;
  automatic: boolean;
  balance_transaction: string;
  created: number;
  currency: string;
  description: string | null;
  destination: string;
  failure_balance_transaction: null;
  failure_code: null;
  failure_message: null;
  livemode: boolean;
  metadata: object;
  method: string;
  original_payout: null;
  reconciliation_status: string;
  reversed_by: null;
  source_type: string;
  statement_descriptor: string | null;
  status: string;
  type: string;
}

export interface CreateStripeBankAccountBody {
  source: {
    account_number: string;
    country: string;
    currency: string;
    object: "bank_account";
    account_holder_name: string;
    account_holder_type: "individual" | "company";
    routing_number: string;
  };
}
