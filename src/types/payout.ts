import type { PayoutStatus } from "@/utils";

import type { BuukiaPaymentProvider } from "./payment";

export interface CreatePayoutBody {
  amount: number;
  description: string;
  method: "instant" | "standard";
  destination: string;
}

export interface UpdatePayoutBody extends CreatePayoutBody {
  id: string;
}

type BuukiaFee = {
  rate: number;
  amount: number;
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