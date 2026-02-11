import { createFileRoute } from "@tanstack/react-router";

import Transactions from "@/containers/Transactions";

export const Route = createFileRoute("/transactions")({
  component: Transactions,
})
