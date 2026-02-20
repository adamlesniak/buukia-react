
type AvailabilitySlotTime = { start: string; end: string };

export type AvailabilitySlot = {
  times: AvailabilitySlotTime[];
  dayOfWeek: number;
};

export type AvailabilityException = {
  date: string;
  startTime: string;
  endTime: string;
};

export type Availability = {
  regular: AvailabilitySlot[];
  // exceptions: AvailabilityException[];
  // holidays: string[];
};
