import { createFileRoute } from "@tanstack/react-router";

import AccountBusiness from "@/containers/AccountBusiness";

export const Route = createFileRoute("/account/business/")({
  component: AccountBusiness,
});
