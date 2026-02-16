import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/containers/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
