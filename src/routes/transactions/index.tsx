import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions/")({
  beforeLoad: async () => {
    throw redirect({
      to: `/transactions/payments`,
      params: {} as never,
    });
  },
});
