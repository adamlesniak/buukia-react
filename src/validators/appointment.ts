import { z } from "zod";

import { clientSchema } from "./client";
import { serviceSchema } from "./service";

export const appointmentFormSchema = z.object({
  client: z
    .array(clientSchema)
    .min(1, { message: "appointments.form.errors.clientError" }),
  services: z
    .array(serviceSchema)
    .min(1, { message: "appointments.form.errors.servicesError" }),
  assistantName: z
    .string()
    .min(1, { message: "appointments.form.errors.assistantNameError" }),
  time: z.string().min(1, { message: "appointments.form.errors.timeError" }),
});

export const appointmentSchema = appointmentFormSchema.extend({
  id: z.string().min(1),
});
