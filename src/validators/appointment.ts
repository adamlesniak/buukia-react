import { z } from "zod";

import { serviceFormSchema } from "./service";

export const appointmentFormSchema = z.object({
  clientName: z
    .string()
    .min(1, { message: "appointments.form.errors.clientNameError" }),
  services: z
    .array(
      serviceFormSchema.extend({
        id: z.string(),
        business: z.string(),
      }),
    )
    .min(1, { message: "appointments.form.errors.servicesError" }),
  assistantName: z
    .string()
    .min(1, { message: "appointments.form.errors.assistantNameError" }),
  time: z.string().min(1, { message: "appointments.form.errors.timeError" }),
});
