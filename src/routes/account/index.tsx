import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/account/")({
  beforeLoad: async () => {
    throw redirect({
      to: `/account/personal`,
    });
  },
});
