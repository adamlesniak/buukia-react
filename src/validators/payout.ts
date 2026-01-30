import { z } from "zod";

export const payoutFormSchema = z.object({
  amount: z.number().min(0.5).max(9999),
  description: z.string().min(1),
});
