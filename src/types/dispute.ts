import type { PaymentStatus } from '@/utils';

import type { BuukiaPaymentProvider, PaymentMethod, PaymentMethodBilling } from './payment';

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