import { createFileRoute } from "@tanstack/react-router";

import AccountPersonal from "@/containers/AccountPersonal";

export const Route = createFileRoute("/account/personal/")({
  component: AccountPersonal,
});
