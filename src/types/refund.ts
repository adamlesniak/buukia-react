import type { StripeRefundReason } from "./stripe";

export interface CreateRefundBody {
  amount: number;
  charge: string;
  reason: StripeRefundReason;
  payment_intent: string | null;
  metadata: {
    description: string;
  };
}