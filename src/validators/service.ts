import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  duration: z
    .string()
    .regex(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/g, { message: "not valid number" }),
  price: z.number().min(1),
});
