import { createFileRoute } from '@tanstack/react-router'

import Payments from '@/containers/Payments'

export const Route = createFileRoute('/transactions/payouts/')({
  component: Payments,
})