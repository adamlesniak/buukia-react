import { createFileRoute } from '@tanstack/react-router'

import Assistants from '@/containers/Assistants'


export const Route = createFileRoute('/assistants')({
  component: Assistants,
})