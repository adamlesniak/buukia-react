// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const appointmentQueryKeys = {
  all: ["appointments"],
  details: () => [...appointmentQueryKeys.all, "detail"],
  dashboard: () => [...appointmentQueryKeys.all, "dashboard"],
  detail: (id: string) => [...appointmentQueryKeys.details(), id],
  pagination: (page: number) => [
    ...appointmentQueryKeys.all,
    "pagination",
    page,
  ],
  infinite: () => [...appointmentQueryKeys.all, "infinite"],
};
