import { z } from "zod";

import { availabilitySchema } from "./availability";
import { categorySchema } from "./category";

export const assistantFormSchema = z.object({
  availability: z.array(availabilitySchema).length(7),
  firstName: z.string().min(1, { message: "assistants.form.errors.firstName" }),
  lastName: z.string().min(1, { message: "assistants.form.errors.lastName" }),
  email: z.email({ message: "assistants.form.errors.emailError" }),
  categories: z.array(categorySchema).min(1),
});

export const assistantSchema = assistantFormSchema.extend({
  id: z.string().min(1),
});
