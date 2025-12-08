import { parseISO } from "date-fns";

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

export const createAppointment = (item: Partial<BuukiaAppointment>) => ({
  id: item.id || "",
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
    ...item.assistant,
  },
  time: item.time ? new Date(item.time).toISOString() : "",
  client: {
    id: "",
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    appointments: [],
    ...item.client,
  },
  services: item.services ? item.services : [],
});

export const createService = (item: Partial<BuukiaService>) => ({
  id: "",
  name: "",
  description: "",
  price: 0,
  duration: 15,
  business: "",
  category: "",
  ...item,
});

export const createAssistant = (item: Partial<BuukiaAssistant>) => ({
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

export const createClient = (item: Partial<BuukiaClient>) => ({
  id: "",
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  phone: "",
  appointments: [],
  ...item,
});
