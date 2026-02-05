import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

import type { CreateRefundBody } from "@/types";
import {
  createStripeRefund,
  type StripeCharge,
  type StripeRefund,
} from "scripts/mocksStripe";

import data from "../routes/data-stripe.json";

const [charges, refunds]: [
  Map<string, StripeCharge>,
  Map<string, StripeRefund>,
] = [
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
];
