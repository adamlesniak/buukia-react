import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

import type { CreateRefundBody, CreateStripeBankAccountBody } from "@/types";
import {
  createStripeBankAccount,
  createStripeRefund,
  type StripeBankAccount,
  type StripeCharge,
  type StripeRefund,
} from "scripts/mocksStripe";

import data from "../routes/data-stripe.json";

const [bankAccounts, charges, refunds]: [
  Map<string, StripeBankAccount>,
  Map<string, StripeCharge>,
  Map<string, StripeRefund>,
] = [
  new Map(
    data.bankAccounts.map((bankAccount) => [
      bankAccount.id,
      bankAccount as unknown as StripeBankAccount,
    ]),
  ),
  new Map(
    data.charges.map((charge) => [
      charge.id,
      charge as unknown as StripeCharge,
    ]),
  ),
  new Map(
    data.refunds.map((refund) => [
      refund.id,
      refund as unknown as StripeRefund,
    ]),
  ),
];

export const handlersStripe = [
  http.get("/v1/customers/:customerId/bank_accounts", ({ request }) => {
    const [limitParam] = [new URL(request.url).searchParams.get("limit")];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json({
      object: "list",
      url: "/v1/bank_accounts",
      has_more: false,
      data: Array.from(bankAccounts.values()).slice(0, limit),
    });
  }),

  http.post<never, CreateStripeBankAccountBody>(
    "/v1/customers/:customerId/sources",
    async ({ request }) => {
      const body = await request.json();

      const id = uuidv4();

      const refund = {
        ...createStripeBankAccount(),
        account_holder_name: body.source.account_holder_name,
        account_holder_type: body.source.account_holder_type,
        bank_name: "TEST BANK",
        country: body.source.country,
        currency: body.source.currency,
        customer: `cus_${faker.string.alphanumeric(14)}`,
        fingerprint: faker.string.alphanumeric(16),
        last4: faker.finance.accountNumber(4),
        metadata: {},
        routing_number: faker.finance.routingNumber(),
        status: "verified",
      } as StripeBankAccount;

      bankAccounts.set(id, refund);

      return HttpResponse.json(refund);
    },
  ),

  http.post<never, CreateRefundBody>("/v1/refunds", async ({ request }) => {
    const body = await request.json();

    const id = uuidv4();

    const refund = {
      ...createStripeRefund(),
      amount: body.amount,
      charge: body.charge,
      reason: body.reason,
      payment_intent: null,
      metadata: body.metadata,
    } as StripeRefund;

    refunds.set(id, refund);

    if (refund.charge) {
      const charge = charges.get(refund.charge);

      charges.set(refund.charge, {
        ...charge,
        refunded: true,
        refunds: {
          object: "list",
          data: [...(charge?.refunds?.data ?? []), refund],
          has_more: false,
          url: `/v1/charges/${refund.charge}/refunds`,
        },
      } as StripeCharge);
    }

    return HttpResponse.json(refund);
  }),

  http.get("/v1/refunds", ({ request }) => {
    const [limitParam] = [new URL(request.url).searchParams.get("limit")];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json({
      object: "list",
      url: "/v1/refunds",
      has_more: false,
      data: Array.from(refunds.values()).slice(0, limit),
    });
  }),

  http.get("/v1/charges", ({ request }) => {
    const [limitParam] = [new URL(request.url).searchParams.get("limit")];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json({
      object: "list",
      url: "/v1/charges",
      has_more: false,
      data: Array.from(charges.values()).slice(0, limit),
    });
  }),

  http.get("/v1/charges/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = charges.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Charge not found" },
        { status: 404 },
      );
    }
  }),
];
