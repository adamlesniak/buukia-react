import { parseISO } from "date-fns";

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
