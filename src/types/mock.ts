import type { BuukiaAccount } from "./account";
import type { BuukiaAppointment } from "./appointment";
import type { BuukiaAssistant } from "./assistant";
import type { BuukiaCategory } from "./category";
import type { BuukiaClient } from "./client";
import type { BuukiaPayment } from "./payment";
import type { BuukiaPayout } from "./payout";
import type { BuukiaService } from "./service";

export type MockData = {
  accounts: BuukiaAccount[];
  appointments: BuukiaAppointment[];
  assistants: BuukiaAssistant[];
  categories: BuukiaCategory[];
  clients: BuukiaClient[];
  payments: BuukiaPayment[];
  payouts: BuukiaPayout[];
  services: BuukiaService[];
};

// API Response Types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};
