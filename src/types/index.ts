import type { PaymentStatus, PayoutStatus } from "@/utils";

export interface CreateAppointmentBody {
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export interface UpdateAppointmentBody {
  id: string;
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}
export interface CreateServiceBody {
  name: string;
  category: BuukiaCategory;
  duration: string;
  description: string;
  price: number;
}

export interface UpdateServiceBody extends CreateServiceBody {
  id: string;
}

export interface CreateCategoryBody {
  name: string;
}

export interface UpdateCategoryBody extends CreateCategoryBody {
  id: string;
}

export interface CreateAssistantBody {
  firstName: string;
  lastName: string;
  email: string;
  categories: BuukiaCategory[];
  availability: AvailabilitySlot[];
  holidays?: string;
}

export interface UpdateAssistantBody extends CreateAssistantBody {
  id: string;
}

export interface CreatePayoutBody {
  amount: number;
  description: string;
}

export interface UpdatePayoutBody extends CreatePayoutBody {
  id: string;
}

export type PayoutFormValues = {
  amount: string;
  description: string;
};

export type AssistantFormValues = {
  availability: AvailabilitySlot[];
  categories: BuukiaCategory[];
  email: string;
  firstName: string;
  lastName: string;
};

export type AppointmentFormValues = {
  assistantName: string;
  client: BuukiaClient[];
  time: string;
  services: BuukiaService[];
};

export type NewCategoryFormValues = {
  name: string;
};

export type ServiceFormValues = {
  category: BuukiaCategory[];
  description: string;
  duration: string;
  name: string;
  price: string;
};

export type BuukiaAssistant = {
  id: string;
  availability: AvailabilitySlot[];
  categories: BuukiaCategory[];
  email: string;
  firstName: string;
  initials: string;
  lastName: string;
  name: string;
  holidays: string;
};

export type BuukiaService = {
  id: string;
  description: string;
  category: BuukiaCategory;
  duration: string;
  name: string;
  price: number;
};

export type BuukiaClient = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
};

type BuukiaPaymentProvider = "stripe";

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

type PaymentOutcome = {
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

type PaymentMethodBilling = {
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

type PaymentMethod = {
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

export type BuukiaPayout = {
  id: string;
  amount: number;
  arrivalDate: string;
  createdAt: string;
  currency: string;
  description: string;
  statement_description: string;
  destination: string;
  provider: BuukiaPaymentProvider;
  sourceId: string;
  status: PayoutStatus;
  fee: BuukiaFee;
  type: "bank_account" | "card";
};

type BuukiaFee = {
  rate: number;
  amount: number;
};

export type BuukiaAppointment = {
  id: string;
  assistant: BuukiaAssistant;
  time: string;
  client: BuukiaClient;
  services: BuukiaService[];
  payments: BuukiaPayment[];
};

export type BuukiaCategory = {
  id: string;
  name: string;
};

export type BuukiaDispute = {
  id: string;
  createdAt: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: PaymentMethod;
  provider: BuukiaPaymentProvider;
  refunded: boolean;
  disputed: boolean;
  sourceId: string;
  status: PaymentStatus;
  billing: PaymentMethodBilling;
};

export type MockData = {
  appointments: BuukiaAppointment[];
  assistants: BuukiaAssistant[];
  categories: BuukiaCategory[];
  clients: BuukiaClient[];
  payments: BuukiaPayment[];
  payouts: BuukiaPayout[];
  services: BuukiaService[];
};

// API Response Types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

// Form Types
export type ComboboxItem = {
  id: string;
  name: string;
  value: string;
};

// Business Types
export type BusinessCategory = string;

type AvailabilitySlotTime = { start: string; end: string };

export type AvailabilitySlot = {
  times: AvailabilitySlotTime[];
  dayOfWeek: number;
};

export type AvailabilityException = {
  date: string;
  startTime: string;
  endTime: string;
};

export type Availability = {
  regular: AvailabilitySlot[];
  // exceptions: AvailabilityException[];
  // holidays: string[];
};
