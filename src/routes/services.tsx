import { createFileRoute } from "@tanstack/react-router";

import Services from "@/containers/Services";

export const Route = createFileRoute("/services")({
  component: Services,
});
