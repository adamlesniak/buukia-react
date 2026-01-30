import { z } from "zod";

import { categorySchema } from "./category";

export const serviceFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.array(categorySchema).min(1),
  duration: z
    .string()
    .regex(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/g, { message: "not valid number" }),
  price: z.codec(z.coerce.number().min(1), z.string(), {
    decode: (data) => data.toString(),
    encode: (data) => Number(data),
  }),
});

export const serviceSchema = serviceFormSchema.extend({
  id: z.string().min(1),
  category: categorySchema,
});
