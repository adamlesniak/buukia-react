import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/assistants/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/assistants/new/"!</div>
}
