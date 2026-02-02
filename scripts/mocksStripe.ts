import * as fs from "node:fs";
import path from "node:path";

import { faker } from "@faker-js/faker";
import prettier from "prettier";

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
      city: null;
      country: null;
      line1: null;
      line2: null;
      postal_code: null;
      state: null;
    };
    email: null;
    name: null;
    phone: null;
  };
  calculated_statement_descriptor: string;
  captured: boolean;
  created: number;
  currency: string;
  customer: null;
  description: null;
  disputed: boolean;
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
        address_line1_check: null;
        address_postal_code_check: null;
        cvc_check: null;
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

export interface StripeDispute {
  id: string;
  object: "dispute";
  amount: number;
  balance_transactions: [];
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
  is_charge_refundable: boolean;
  livemode: boolean;
  metadata: object;
  payment_intent: null;
  reason: string;
  status: string;
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

export const createStripeCharge = (): StripeCharge => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const isSucceeded = faker.datatype.boolean({ probability: 0.8 });

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
        city: null,
        country: null,
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      },
      email: null,
      name: null,
      phone: null,
    },
    calculated_statement_descriptor: "Stripe",
    captured: isSucceeded,
    created: Math.floor(Date.now() / 1000),
    currency: faker.helpers.arrayElement(["usd", "eur", "gbp"]),
    customer: null,
    description: null,
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
          address_line1_check: null,
          address_postal_code_check: null,
          cvc_check: null,
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
    "warning_needs_response",
    "warning_under_review",
    "warning_closed",
    "needs_response",
    "under_review",
    "won",
    "lost",
  ]);
  const reason = faker.helpers.arrayElement([
    "general",
    "chargeback",
    "refund",
    "duplicate",
    "fraudulent",
    "subscription_canceled",
    "product_unacceptable",
    "product_not_received",
    "unrecognized",
    "credit_not_processed",
    "customer_initiated",
  ]);
  const dueBy = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  return {
    id: `du_${faker.string.alphanumeric(24)}`,
    object: "dispute",
    amount,
    balance_transactions: [],
    charge: `ch_${faker.string.alphanumeric(24)}`,
    created: Math.floor(Date.now() / 1000),
    currency: faker.helpers.arrayElement(["usd", "eur", "gbp"]),
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
  const now = Math.floor(Date.now() / 1000);
  const arrivalDate = now + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60;

  return {
    id: `po_${faker.string.alphanumeric(24)}`,
    object: "payout",
    amount,
    arrival_date: arrivalDate,
    automatic: faker.datatype.boolean({ probability: 0.7 }),
    balance_transaction: `txn_${faker.string.alphanumeric(24)}`,
    created: now,
    currency: faker.helpers.arrayElement(["usd", "eur", "gbp"]),
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
  charges: StripeCharge[];
  payouts: StripePayout[];
  disputes: StripeDispute[];
};

const main = async (): Promise<void> => {
  const data: StripeMockData = {
    charges: Array.from({ length: 10 }).map(() => ({
      ...createStripeCharge(),
    })),
    payouts: Array.from({ length: 10 }).map(() => ({
      ...createStripePayout(),
    })),
    disputes: Array.from({ length: 10 }).map(() => ({
      ...createStripeDispute(),
    })),
  };

  const formattedCode = await prettier.format(JSON.stringify(data), {
    parser: "json",
  });

  fs.writeFileSync(path.resolve("src/routes/data-stripe.json"), formattedCode);
  console.log("✅ Mock data generated successfully!");
};

main();
