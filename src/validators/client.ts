import { z } from "zod";

export const clientFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
});

export const clientSchema = clientFormSchema.extend({
  id: z.string().min(1),
});
