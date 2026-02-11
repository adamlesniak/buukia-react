import { z } from "zod";

export const bankAccountFormSchema = z.object({
  accountNumber: z.string().min(8).max(34),
  country: z.string().min(0).max(500),
  currency: z.string().min(0).max(500),
  accountHolderName: z.string().min(1).max(500),
  accountHolderType: z.string().min(1).max(500),
  routingNumber: z.string().min(0).max(500),
});
