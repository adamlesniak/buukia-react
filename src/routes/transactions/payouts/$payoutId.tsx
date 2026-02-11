import { createFileRoute } from "@tanstack/react-router";

import PayoutDetail from "@/containers/PayoutDetail";

export const Route = createFileRoute("/transactions/payouts/$payoutId")({
  component: PayoutDetail,
});
