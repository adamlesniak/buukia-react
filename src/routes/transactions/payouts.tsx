import { createFileRoute } from '@tanstack/react-router'

import Payouts from "@/containers/Payouts";

export const Route = createFileRoute('/transactions/payouts')({
  component: Payouts,
})