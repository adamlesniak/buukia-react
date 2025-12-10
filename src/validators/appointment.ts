import { z } from "zod";

export const appointmentFormSchema = z.object({
  clientName: z
    .string()
    .min(1, { message: "appointments.form.errors.clientNameError" }),
  services: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        duration: z.number(),
        business: z.string(),
        category: z.string(),
      }),
    )
    .min(1, { message: "appointments.form.errors.servicesError" }),
  assistantName: z
    .string()
    .min(1, { message: "appointments.form.errors.assistantNameError" }),
  time: z.string().min(1, { message: "appointments.form.errors.timeError" }),
});
