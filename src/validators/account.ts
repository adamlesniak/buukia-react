import { z } from "zod";

export const accountFormSchema = z.object({
  name: z.string().min(1, { message: "account.detail.form.errors.name" }),
  email: z.email({ message: "account.detail.form.errors.email" }),
  dob: z
    .string()
    .min(1, { message: "account.detail.form.errors.dob" })
    .refine(
      (value) => {
        console.log(value);
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        console.log(day, month, year);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      },
      { message: "account.detail.form.errors.dobInvalid" },
    ),
  tel: z.string().min(1, { message: "account.detail.form.errors.tel" }),
});
