// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const bankAccountQueryKeys = {
  all: ["bankAccounts"],
  details: () => [...bankAccountQueryKeys.all, "detail"],
  detail: (id: string) => [...bankAccountQueryKeys.details(), id],
  pagination: (page: number) => [
    ...bankAccountQueryKeys.all,
    "pagination",
    page,
  ],
  infinite: () => [...bankAccountQueryKeys.all, "infinite"],
};
