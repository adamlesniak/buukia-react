import { z } from "zod";

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  times: z
    .array(
      z.object({
        start: z.string().min(1),
        end: z.string().min(1),
      }),
    )
    .min(1),
});
