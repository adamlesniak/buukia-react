import { z } from "zod";

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  times: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .min(1),
});
