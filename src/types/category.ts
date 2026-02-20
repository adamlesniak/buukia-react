export interface CreateCategoryBody {
  name: string;
}

export interface UpdateCategoryBody extends CreateCategoryBody {
  id: string;
}

export type BuukiaCategory = {
  id: string;
  name: string;
};
// Business Types
export type BusinessCategory = string;
