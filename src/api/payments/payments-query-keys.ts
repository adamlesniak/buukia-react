// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const paymentQueryKeys = {
  all: ['payments'],
  details: () => [...paymentQueryKeys.all, 'detail'],
  detail: (id: string) => [...paymentQueryKeys.details(), id],
  pagination: (page: number) => [...paymentQueryKeys.all, 'pagination', page],
  infinite: () => [...paymentQueryKeys.all, 'infinite'],
};