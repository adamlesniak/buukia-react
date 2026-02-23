import { z } from "zod";

export const accountFormSchema = z.object({
  name: z.string().min(1, { message: "account.detail.form.errors.name" }),
  email: z.email({ message: "account.detail.form.errors.email" }),
  dob: z
    .string()
    .min(1, { message: "account.detail.form.errors.dob" })
    .refine(
      (value) => {
        const [day, month, year] = [
          value.substr(0, 2),
          value.substr(2, 2),
          value.substr(4, 4),
        ];
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return (
          date.getFullYear() >= Number(1920) &&
          date.getMonth() === Number(month) - 1 &&
          date.getDate() === Number(day)
        );
      },
      { message: "account.detail.form.errors.dobInvalid" },
    ),
  tel: z
    .string()
    .length(9, { message: "account.detail.form.errors.tel" })
});
