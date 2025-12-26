import type { QueryClient } from "@tanstack/query-core";
import { addDays, getUnixTime, parseISO, startOfWeek } from "date-fns";

import { appointmentQueryKeys } from "@/api/appointments/appointments-query-keys";
import type {
  BuukiaAppointment,
  BuukiaAssistant,
  BuukiaClient,
  BuukiaService,
} from "@/types";

export const isoDateMatchDate = (date1: string, date2: string) => {
  const [date1Parsed, date2Parsed] = [parseISO(date1), parseISO(date2)];
  return (
    date1Parsed.getFullYear() === date2Parsed.getFullYear() &&
    date1Parsed.getMonth() === date2Parsed.getMonth() &&
    date1Parsed.getDate() === date2Parsed.getDate()
  );
};

export const isoDateMatchDateTime = (date1: string, date2: string) => {
  const [date1Parsed, date2Parsed] = [parseISO(date1), parseISO(date2)];
  return (
    date1Parsed.getFullYear() === date2Parsed.getFullYear() &&
    date1Parsed.getMonth() === date2Parsed.getMonth() &&
    date1Parsed.getDate() === date2Parsed.getDate() &&
    date1Parsed.getHours() === date2Parsed.getHours() &&
    date1Parsed.getMinutes() === date2Parsed.getMinutes()
  );
};

export const createAppointment = (item?: Partial<BuukiaAppointment>) => ({
  id: item?.id || "",
  assistant: {
    id: "",
    firstName: "",
    lastName: "",
    name: "",
    initials: "",
    availability: {
      regular: [],
      exceptions: [],
      holidays: [],
    },
    business: "",
    type: "",
    ...item?.assistant,
  },
  time: item?.time ? new Date(item.time).toISOString() : "",
  client: {
    id: "",
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    appointments: [],
    ...item?.client,
  },
  services: item?.services ? item.services : [],
});

export const createService = (item?: Partial<BuukiaService>) => ({
  id: "",
  name: "",
  description: "",
  price: 0,
  duration: 15,
  business: "",
  category: "",
  ...item,
});

export const createAssistant = (item?: Partial<BuukiaAssistant>) => ({
  id: "",
  firstName: "",
  lastName: "",
  name: "",
  initials: "",
  availability: { regular: [], exceptions: [], holidays: [] },
  business: "",
  type: "",
  ...item,
});

export const createClient = (item?: Partial<BuukiaClient>) => ({
  id: "",
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  phone: "",
  appointments: [],
  ...item,
});

export const createCurrentAppointment = (
  queryClient: QueryClient,
  assistantId: string,
  clientName: string,
  time: string,
  servicesDuration: number,
) => {
  queryClient.setQueryData(
    appointmentQueryKeys.all,
    (old: BuukiaAppointment[] | undefined) => {
      if (!Boolean(old?.find((item) => item.id === "current-appointment"))) {
        return [
          ...(old || []),
          createAppointment({
            id: "current-appointment",
            assistant: createAssistant({ id: assistantId }),
            client: createClient({ name: clientName }),
            services: [createService({ duration: 15 })],
            time: new Date(time).toISOString(),
          }),
        ];
      }

      return [
        ...(old?.filter((i) => i.id !== "current-appointment") || []),
        createAppointment({
          id: "current-appointment",
          assistant: createAssistant({ id: assistantId }),
          client: createClient({ name: clientName }),
          services: [
            createService({
              duration: servicesDuration || 15,
            }),
          ],
          time: new Date(time).toISOString(),
        }),
      ];
    },
  );
};

export const updateExistingAppointment = (
  queryClient: QueryClient,
  appointmentId: string,
  assistantId: string,
  clientName: string,
  time: string,
  servicesDuration: number,
) => {
  queryClient.setQueryData(
    appointmentQueryKeys.all,
    (old: BuukiaAppointment[] | undefined) => {
      const result = old?.map((item) => {
        if (item.id === appointmentId) {
          return createAppointment({
            id: appointmentId,
            assistant: createAssistant({ id: assistantId }),
            client: createClient({ name: clientName }),
            services: [
              createService({
                duration: servicesDuration || 15,
              }),
            ],
            time: new Date(time).toISOString(),
          });
        }

        return item;
      });

      return result;
    },
  );
};

export const getWeekStartEndDate = (date: string) => {
  const start = getUnixTime(startOfWeek(new Date(date))) * 1000;
  const end = getUnixTime(addDays(start, 7)) * 1000;

  return { start, end };
};
