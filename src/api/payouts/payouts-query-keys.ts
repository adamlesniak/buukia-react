// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const payoutQueryKeys = {
  all: ["payouts"],
  stats: () => [...payoutQueryKeys.all, "stats"],
  details: () => [...payoutQueryKeys.all, "detail"],
  detail: (id: string) => [...payoutQueryKeys.details(), id],
  pagination: (page: number) => [...payoutQueryKeys.all, "pagination", page],
  infinite: () => [...payoutQueryKeys.all, "infinite"],
};
