import type { AvailabilitySlot } from "./availability";
import type { BuukiaCategory } from "./category";

export type BuukiaAssistant = {
  id: string;
  availability: AvailabilitySlot[];
  categories: BuukiaCategory[];
  email: string;
  firstName: string;
  initials: string;
  lastName: string;
  name: string;
  holidays: string;
};


export interface CreateAssistantBody {
  firstName: string;
  lastName: string;
  email: string;
  categories: BuukiaCategory[];
  availability: AvailabilitySlot[];
  holidays?: string;
}

export interface UpdateAssistantBody extends CreateAssistantBody {
  id: string;
}
