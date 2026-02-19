import { createFileRoute } from '@tanstack/react-router'

import AccountBank from '@/containers/AccountBank'

export const Route = createFileRoute('/account/bank/')({
  component: AccountBank,
})