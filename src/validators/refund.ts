import { z } from "zod";

export const refundFormSchema = z.object({
  description: z.string().min(0).max(500),
  reason: z.string().min(1).max(500),
  amount: z.codec(z.coerce.number().min(0.5).max(9999), z.string(), {
    decode: (data) => data.toString(),
    encode: (data) => Number(data),
  }),
});
