import { createFileRoute } from "@tanstack/react-router";

import PaymentDetail from "@/containers/PaymentDetail";

export const Route = createFileRoute("/transactions/payments/$chargeId")({
  component: PaymentDetail,
});
