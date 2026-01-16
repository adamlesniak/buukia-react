import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1),
});

export const categorySchema = categoryFormSchema.extend({
  id: z.string().min(1),
});
