import type { AvailabilitySlot } from "./availability";
import type { BuukiaCategory } from "./category";
import type { BuukiaClient } from "./client";

export type PersonalFormValues = {
  avatar: string;
  name: string;
  email: string;
  dob: string;
  tel: string;
};

export type BusinessFormValues = {
  name: string;
  address: string;
  city: string;
  county: string;
  code: string;
  country: string;
  taxNumber: string;
  tel: string;
};

export type AccountFormValues = {
  name: string;
  email: string;
  dob: string;
  tel: string;
};

export type PayoutFormValues = {
  amount: string;
  description: string;
  bankAccountId: string;
  method: string;
};


export type AssistantFormValues = {
  availability: AvailabilitySlot[];
  categories: BuukiaCategory[];
  email: string;
  firstName: string;
  lastName: string;
};

export type AppointmentFormValues = {
  assistantName: string;
  client: BuukiaClient[];
  time: string;
  services: {
    id: string;
    description: string;
    category: BuukiaCategory;
    duration: string;
    name: string;
    price: string;
  }[];
};

export type ServiceFormValues = {
  category: BuukiaCategory[];
  description: string;
  duration: string;
  name: string;
  price: string;
};

export type NewCategoryFormValues = {
  name: string;
};
