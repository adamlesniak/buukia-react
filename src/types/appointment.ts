import type { BuukiaAssistant } from "./assistant";
import type { BuukiaClient } from "./client";
import type { BuukiaPayment } from "./payment";
import type { BuukiaService } from "./service";

export interface CreateAppointmentBody {
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export interface UpdateAppointmentBody {
  id: string;
  dashboard: boolean;
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export type BuukiaAppointment = {
  id: string;
  assistant: BuukiaAssistant;
  time: string;
  client: BuukiaClient;
  services: BuukiaService[];
  stats: {
    services: {
      price: number;
      duration: number;
    };
  };
  payments: BuukiaPayment[];
};
