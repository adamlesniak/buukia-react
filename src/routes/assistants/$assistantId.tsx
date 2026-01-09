import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/assistants/$assistantId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/assistants/$assistantId"!</div>
}
