import { createFileRoute } from "@tanstack/react-router";

import ServiceDetail from "@/containers/ServiceDetail";

export const Route = createFileRoute("/services/new/")({
  component: ServiceDetail,
});
