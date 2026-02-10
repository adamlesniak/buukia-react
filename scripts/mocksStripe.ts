import * as fs from "node:fs";
import path from "node:path";

import { faker } from "@faker-js/faker";
import { roundToNearestMinutes } from "date-fns";
import prettier from "prettier";

import { CVCCheckStatus } from "@/types";

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

enum StripeDisputeReason {
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

export const createStripeBankAccount = (): StripeBankAccount => {
  return {
    id: `ba_${faker.string.alphanumeric(24)}`,
    object: "bank_account",
    account_holder_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    account_holder_type: faker.helpers.arrayElement(["individual", "company"]),
    bank_name: faker.company.name(),
    country: faker.location.countryCode(),
    currency: faker.helpers.arrayElement(["usd", "eur", "gbp"]),
    customer: `cus_${faker.string.alphanumeric(14)}`,
    fingerprint: faker.string.alphanumeric(16),
    last4: faker.finance.accountNumber(4),
    metadata: {},
    routing_number: faker.finance.routingNumber(),
    status: faker.helpers.arrayElement(["new", "verified", "failed"]),
  };
};

export const createStripeBalanceTransaction = (): StripeBalanceTransaction => {
  const amount = faker.number.int({ min: -200 * 100, max: 200 * 100 });
  const fee = faker.number.int({ min: 0, max: 3000 });
  const now = Math.floor(Date.now() / 1000);

  return {
    id: `txn_${faker.string.alphanumeric(24)}`,
    object: "balance_transaction",
    amount,
    available_on: now + faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 }),
    balance_type: faker.helpers.arrayElement([
      "payments",
      "refunds",
      "adjustments",
    ]),
    created: now,
    currency: "eur",
    description: faker.lorem.sentence(),
    exchange_rate: null,
    fee,
    fee_details: [
      {
        amount: fee,
        application: null,
        currency: "eur",
        description: faker.helpers.arrayElement([
          "Stripe fee",
          "Dispute fee",
          "Refund fee",
        ]),
        type: "stripe_fee",
      },
    ],
    net: amount - fee,
    reporting_category: faker.helpers.arrayElement([
      "payments",
      "disputes",
      "refunds",
      "adjustments",
    ]),
    source: `${faker.helpers.arrayElement(["ch", "du", "po"])}_${faker.string.alphanumeric(24)}`,
    status: faker.helpers.arrayElement(["available", "pending", "failed"]),
    type: faker.helpers.arrayElement(["charge", "refund", "adjustment"]),
  };
};

export const createStripeCharge = (): StripeCharge => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const isSucceeded = faker.datatype.boolean({ probability: 0.8 });
  const now = roundToNearestMinutes(
    faker.date.between({
      from: new Date(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
    { nearestTo: 15 },
  ).getTime();

  return {
    id: `ch_${faker.string.alphanumeric(24)}`,
    object: "charge",
    amount,
    amount_captured: isSucceeded ? amount : 0,
    amount_refunded: 0,
    application: null,
    application_fee: null,
    application_fee_amount: null,
    balance_transaction: `txn_${faker.string.alphanumeric(24)}`,
    billing_details: {
      address: {
        city: faker.location.city(),
        country: faker.location.countryCode(),
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        postal_code: faker.location.zipCode(),
        state: faker.location.state(),
      },
      email: faker.internet.email(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      phone: faker.phone.number(),
    },
    calculated_statement_descriptor: "Stripe",
    captured: isSucceeded,
    created: now,
    currency: "eur",
    customer: null,
    description: faker.lorem.sentence(),
    disputed: faker.datatype.boolean({ probability: 0.1 }),
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    fraud_details: {},
    livemode: false,
    metadata: {},
    on_behalf_of: null,
    outcome: {
      network_status: isSucceeded
        ? "approved_by_network"
        : "declined_by_network",
      reason: null,
      risk_level: faker.helpers.arrayElement(["normal", "elevated", "highest"]),
      risk_score: faker.number.int({ min: 0, max: 99 }),
      seller_message: faker.lorem.sentence(),
      type: faker.helpers.arrayElement([
        "authorized",
        "manual_review",
        "issuer_declined",
        "blocked",
      ]),
    },
    paid: isSucceeded,
    payment_intent: null,
    payment_method: `card_${faker.string.alphanumeric(18)}`,
    payment_method_details: {
      card: {
        brand: faker.helpers.arrayElement([
          "visa",
          "mastercard",
          "amex",
          "discover",
        ]),
        checks: {
          address_line1_check: faker.helpers.arrayElement([
            CVCCheckStatus.Pass,
            CVCCheckStatus.Fail,
            CVCCheckStatus.Unavailable,
            CVCCheckStatus.Unchecked,
          ]),
          address_postal_code_check: faker.helpers.arrayElement([
            CVCCheckStatus.Pass,
            CVCCheckStatus.Fail,
            CVCCheckStatus.Unavailable,
            CVCCheckStatus.Unchecked,
          ]),
          cvc_check: faker.helpers.arrayElement([
            CVCCheckStatus.Pass,
            CVCCheckStatus.Fail,
            CVCCheckStatus.Unavailable,
            CVCCheckStatus.Unchecked,
          ]),
        },
        country: faker.location.countryCode(),
        exp_month: faker.number.int({ min: 1, max: 12 }),
        exp_year: faker.number.int({
          min: new Date().getFullYear(),
          max: 2030,
        }),
        fingerprint: faker.string.alphanumeric(16),
        funding: faker.helpers.arrayElement(["credit", "debit", "prepaid"]),
        installments: null,
        last4: faker.finance.creditCardNumber().slice(-4),
        mandate: null,
        network: faker.helpers.arrayElement([
          "visa",
          "mastercard",
          "amex",
          "discover",
        ]),
        three_d_secure: null,
        wallet: null,
      },
      type: "card",
    },
    receipt_email: null,
    receipt_number: null,
    receipt_url: `https://pay.stripe.com/receipts/payment/${faker.string.alphanumeric(60)}`,
    refunded: false,
    review: null,
    shipping: null,
    source_transfer: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: isSucceeded ? "succeeded" : "failed",
    transfer_data: null,
    transfer_group: null,
  };
};

export const createStripeDispute = (): StripeDispute => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const status = faker.helpers.arrayElement([
    StripeDisputeStatus.WarningNeedsResponse,
    StripeDisputeStatus.WarningUnderReview,
    StripeDisputeStatus.WarningClosed,
    StripeDisputeStatus.NeedsResponse,
    StripeDisputeStatus.UnderReview,
    StripeDisputeStatus.Won,
    StripeDisputeStatus.Lost,
  ]);
  const reason = faker.helpers.arrayElement([
    StripeDisputeReason.General,
    StripeDisputeReason.Chargeback,
    StripeDisputeReason.Refund,
    StripeDisputeReason.Duplicate,
    StripeDisputeReason.Fraudulent,
    StripeDisputeReason.SubscriptionCanceled,
    StripeDisputeReason.ProductUnacceptable,
    StripeDisputeReason.ProductNotReceived,
    StripeDisputeReason.Unrecognized,
    StripeDisputeReason.CreditNotProcessed,
    StripeDisputeReason.CustomerInitiated,
  ]);
  const dueBy = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  return {
    id: `du_${faker.string.alphanumeric(24)}`,
    object: "dispute",
    amount,
    balance_transactions: [createStripeBalanceTransaction()],
    charge: `ch_${faker.string.alphanumeric(24)}`,
    created: Math.floor(Date.now() / 1000),
    currency: "eur",
    evidence: {
      access_activity_log: null,
      billing_address: null,
      cancellation_policy: null,
      cancellation_policy_disclosure: null,
      cancellation_rebuttal: null,
      customer_communication: null,
      customer_email_address: null,
      customer_name: null,
      customer_purchase_ip: null,
      customer_signature: null,
      duplicate_charge_documentation: null,
      duplicate_charge_explanation: null,
      duplicate_charge_id: null,
      product_description: null,
      receipt: null,
      refund_policy: null,
      refund_policy_disclosure: null,
      refund_refusal_explanation: null,
      service_date: null,
      service_documentation: null,
      shipping_address: null,
      shipping_carrier: null,
      shipping_date: null,
      shipping_documentation: null,
      shipping_tracking_number: null,
      uncategorized_file: null,
      uncategorized_text: null,
    },
    evidence_details: {
      due_by: dueBy,
      has_evidence: faker.datatype.boolean({ probability: 0.3 }),
      past_due: faker.datatype.boolean({ probability: 0.2 }),
      submission_count: faker.number.int({ min: 0, max: 3 }),
    },
    is_charge_refundable: faker.datatype.boolean(),
    livemode: false,
    metadata: {},
    payment_intent: null,
    reason,
    status,
    network_reason_code: faker.helpers.arrayElement([
      "13.6",
      "13.7",
      "12.6.1",
      "12.6.2",
      "10.3",
      "10.4",
      "12.2",
      "12.5",
      "13.1",
      "13.2",
      "13.3",
      "13.4",
      "13.5",
    ]),
  };
};

export const createStripeRefund = (): StripeRefund => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const status = faker.helpers.arrayElement(["succeeded", "failed", "pending"]);
  const now = roundToNearestMinutes(
    faker.date.between({
      from: new Date(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
    { nearestTo: 15 },
  ).getTime();

  return {
    id: `re_${faker.string.alphanumeric(24)}`,
    object: "refund",
    amount,
    balance_transaction: `txn_${faker.string.alphanumeric(24)}`,
    charge: `ch_${faker.string.alphanumeric(24)}`,
    created: now,
    currency: "eur",
    destination_details: {
      card: {
        reference: faker.string.numeric(12),
        reference_status: faker.helpers.arrayElement([
          "available",
          "unavailable",
        ]),
        reference_type: "acquirer_reference_number",
        type: "refund",
      },
      type: "card",
    },
    metadata: {},
    payment_intent: faker.datatype.boolean({ probability: 0.8 })
      ? `pi_${faker.string.alphanumeric(24)}`
      : null,
    reason: faker.helpers.arrayElement([
      StripeRefundReason.Duplicate,
      StripeRefundReason.Fraudulent,
      StripeRefundReason.RequestedByCustomer,
    ]),
    receipt_number: faker.string.alphanumeric(16),
    source_transfer_reversal: `trr_${faker.string.alphanumeric(24)}`,
    status,
    transfer_reversal: `tr_${faker.string.alphanumeric(24)}`,
  };
};

export const createStripePayout = (): StripePayout => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const status = faker.helpers.arrayElement([
    "pending",
    "paid",
    "failed",
    "in_transit",
    "canceled",
  ]);
  const method = faker.helpers.arrayElement(["standard", "instant"]);
  const type = faker.helpers.arrayElement(["bank_account", "card"]);
  const sourceType = faker.helpers.arrayElement(["card", "bank_account"]);
  const now = roundToNearestMinutes(
    faker.date.between({
      from: new Date(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
    { nearestTo: 15 },
  ).getTime();
  const arrivalDate = now + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60;

  return {
    id: `po_${faker.string.alphanumeric(24)}`,
    object: "payout",
    amount,
    arrival_date: arrivalDate,
    automatic: faker.datatype.boolean({ probability: 0.7 }),
    balance_transaction: `txn_${faker.string.alphanumeric(24)}`,
    created: now,
    currency: "eur",
    description: faker.datatype.boolean({ probability: 0.3 })
      ? faker.lorem.sentence()
      : null,
    destination: `ba_${faker.string.alphanumeric(24)}`,
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    livemode: false,
    metadata: {},
    method,
    original_payout: null,
    reconciliation_status: faker.helpers.arrayElement([
      "not_applicable",
      "pending",
      "reconciled",
    ]),
    reversed_by: null,
    source_type: sourceType,
    statement_descriptor: faker.datatype.boolean({ probability: 0.4 })
      ? "BUUKIA"
      : null,
    status,
    type,
  };
};

export type StripeMockData = {
  bankAccounts: StripeBankAccount[];
  charges: StripeCharge[];
  payouts: StripePayout[];
  disputes: StripeDispute[];
  refunds: StripeRefund[];
};

const main = async (): Promise<void> => {
  const disputes = Array.from({ length: 10 }).map(() => ({
    ...createStripeDispute(),
  }));

  const data: StripeMockData = {
    bankAccounts: Array.from({ length: 1 }).map(() => ({
      ...createStripeBankAccount(),
    })),
    charges: Array.from({ length: 10 }).map(() => {
      const charge = createStripeCharge();
      return {
        ...charge,
        dispute: charge.disputed
          ? {
              ...createStripeDispute(),
              amount: charge.amount,
              charge: charge.id,
            }
          : undefined,
      };
    }),
    payouts: Array.from({ length: 10 }).map(() => ({
      ...createStripePayout(),
    })),
    disputes,
    refunds: Array.from({ length: 10 }).map(() => ({
      ...createStripeRefund(),
    })),
  };

  const formattedCode = await prettier.format(JSON.stringify(data), {
    parser: "json",
  });

  fs.writeFileSync(path.resolve("src/routes/data-stripe.json"), formattedCode);
  console.log("✅ Mock data generated successfully!");
};

main();
