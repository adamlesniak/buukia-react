export interface CreateAppointmentBody {
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export interface UpdateAppointmentBody {
  id: string;
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}
export interface CreateServiceBody {
  name: string;
  category: BuukiaCategory;
  duration: string;
  description: string;
  price: number;
}

export interface UpdateServiceBody extends CreateServiceBody {
  id: string;
}

export interface CreateCategoryBody {
  name: string;
}

export interface UpdateCategoryBody extends CreateCategoryBody {
  id: string;
}

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
  services: BuukiaService[];
};

export type NewCategoryFormValues = {
  name: string;
};

export type ServiceFormValues = {
  category: BuukiaCategory[];
  description: string;
  duration: string;
  name: string;
  price: number;
};

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

export type BuukiaService = {
  id: string;
  description: string;
  category: BuukiaCategory;
  duration: string;
  name: string;
  price: number;
};

export type BuukiaClient = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
};

export type BuukiaAppointment = {
  id: string;
  assistant: BuukiaAssistant;
  time: string;
  client: BuukiaClient;
  services: BuukiaService[];
};

export type BuukiaCategory = {
  id: string;
  name: string;
};

export type MockData = {
  appointments: BuukiaAppointment[];
  assistants: BuukiaAssistant[];
  clients: BuukiaClient[];
  services: BuukiaService[];
  categories: BuukiaCategory[];
};

// API Response Types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

// Form Types
export type ComboboxItem = {
  id: string;
  name: string;
  value: string;
};

// Business Types
export type BusinessCategory = string;

type AvailabilitySlotTime = { start: string; end: string };

export type AvailabilitySlot = {
  times: AvailabilitySlotTime[];
  dayOfWeek: number;
};

export type AvailabilityException = {
  date: string;
  startTime: string;
  endTime: string;
};

export type Availability = {
  regular: AvailabilitySlot[];
  // exceptions: AvailabilityException[];
  // holidays: string[];
};
