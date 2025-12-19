import { createFileRoute, redirect } from "@tanstack/react-router";
import { startOfDay } from "date-fns";
import { getUnixTime } from "date-fns/getUnixTime";

export const Route = createFileRoute("/appointments/")({
  beforeLoad: async () => {
    throw redirect({
      to: `/appointments/daily/$date`,
      params: { date: getUnixTime(startOfDay(new Date())) * 1000 } as never,
    });
  },
});
