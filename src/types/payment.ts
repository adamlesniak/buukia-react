import type { PaymentStatus } from "@/utils";

export type BuukiaPaymentProvider = "stripe";

export enum PaymentNetworkStatus {
  ApprovedByNetwork = "approved_by_network",
  DeclinedByNetwork = "declined_by_network",
  NotSentToNetwork = "not_sent_to_network",
  ReversedAfterApproval = "reversed_after_approval",
}

export enum PaymentOutcomeType {
  Authorized = "authorized",
  ManualReview = "manual_review",
  IssuerDeclined = "issuer_declined",
  Blocked = "blocked",
  Failed = "failed",
  Approved = "approved",
}

export enum PaymentAdviceCode {
  ConfirmCardData = "confirm_card_data",
  DoNotTryAgain = "do_not_try_again",
  TryAgainLater = "try_again_later",
}

export enum PaymentRiskLevel {
  Normal = "normal",
  Elevated = "elevated",
  Highest = "highest",
  NotAssessed = "not_assessed",
  Unknown = "unknown",
}

export type PaymentOutcome = {
  adviceCode?: PaymentAdviceCode | null;
  networkStatus?: PaymentNetworkStatus | null;
  reason?: PaymentRiskLevel | null;
  riskLevel?: PaymentRiskLevel | null;
  riskScore?: number | null;
  sellerMessage?: string | null;
  type?: PaymentOutcomeType | null;
};

export type BuukiaPayment = {
  id: string;
  createdAt: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: PaymentMethod;
  provider: BuukiaPaymentProvider;
  captured: boolean;
  refunded: boolean;
  disputed: boolean;
  paid: boolean;
  outcome: PaymentOutcome;
  sourceId: string;
  status: PaymentStatus;
  billing: PaymentMethodBilling;
};

export type PaymentMethodBilling = {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postalCode: string;
    state: string;
  };
  email: string;
  name: string;
  phone: string;
  taxId: string;
};

export enum CVCCheckStatus {
  Pass = "pass",
  Fail = "fail",
  Unavailable = "unavailable",
  Unchecked = "unchecked",
}

export type PaymentMethod = {
  amountAuthorized: number;
  brand: string;
  checks: {
    addressLine1Check: CVCCheckStatus;
    addressPostalCodeCheck: CVCCheckStatus;
    cvcCheck: CVCCheckStatus;
  };
  country: string;
  expMonth: number;
  expYear: number;
  fingerprint: string;
  funding: string;
  last4: string;
};