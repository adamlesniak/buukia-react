import { http, HttpResponse } from "msw";

import data from "../routes/data-stripe.json";

export const handlersStripe = [
  http.get("/v1/charges", ({ request }) => {
    const [limitParam] = [new URL(request.url).searchParams.get("limit")];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json({
      object: "list",
      url: "/v1/charges",
      has_more: false,
      data: Array.from(data.charges.values()).slice(0, limit),
    });
  }),

  http.get("/v1/payouts", ({ request }) => {
    const [limitParam] = [new URL(request.url).searchParams.get("limit")];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json({
      object: "list",
      url: "/v1/payouts",
      has_more: false,
      data: Array.from(data.payouts.values()).slice(0, limit),
    });
  }),
];
