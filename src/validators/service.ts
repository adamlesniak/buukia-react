import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  duration: z.number().min(0),
  price: z.number().min(0),
});
