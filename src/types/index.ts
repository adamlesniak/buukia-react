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
  category: string;
  duration: number;
  description: string;
  price: number;
}

export interface UpdateServiceBody extends CreateServiceBody {
  id: string;
}

export type AppointmentFormValues = {
  assistantName: string;
  clientName: string;
  time: string;
  services: BuukiaService[];
};

export type ServiceFormValues = {
  category: string;
  description: string;
  duration: number;
  name: string;
  price: number;
};

export type BuukiaAssistant = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  availability: Availability;
  business: string;
  type: string;
};

export type BuukiaService = {
  id: string;
  description: string;
  business: string;
  category: string;
  duration: number;
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
  appointments: BuukiaAppointment[];
};

export type BuukiaAppointment = {
  id: string;
  assistant: BuukiaAssistant;
  time: string;
  client: BuukiaClient;
  services: BuukiaService[];
};

export type MockData = {
  appointments: BuukiaAppointment[];
  assistants: BuukiaAssistant[];
  clients: BuukiaClient[];
  services: BuukiaService[];
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
export type BusinessCategory = "Beauty" | "Wellness" | "Health" | "Fitness";

export type AvailabilitySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type AvailabilityException = {
  date: string;
  startTime: string;
  endTime: string;
};

export type Availability = {
  regular: AvailabilitySlot[];
  exceptions: AvailabilityException[];
  holidays: string[];
};
