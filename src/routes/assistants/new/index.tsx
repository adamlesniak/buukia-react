import { createFileRoute } from '@tanstack/react-router'

import AssistantDetail from '@/containers/AssistantDetail'

export const Route = createFileRoute('/assistants/new/')({
  component: AssistantDetail,
})