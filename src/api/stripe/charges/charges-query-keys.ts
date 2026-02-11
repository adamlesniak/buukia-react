// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const chargeQueryKeys = {
  all: ['charges'],
  stats: () => [...chargeQueryKeys.all, 'stats'],
  details: () => [...chargeQueryKeys.all, 'detail'],
  detail: (id: string) => [...chargeQueryKeys.details(), id],
  pagination: (page: number) => [...chargeQueryKeys.all, 'pagination', page],
  infinite: () => [...chargeQueryKeys.all, 'infinite'],
};