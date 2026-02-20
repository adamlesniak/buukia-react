import type { BuukiaCategory } from ".";

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

export type BuukiaService = {
  id: string;
  description: string;
  category: BuukiaCategory;
  duration: string;
  name: string;
  price: number;
};