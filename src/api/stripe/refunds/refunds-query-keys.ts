// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const refundQueryKeys = {
  all: ['refunds'],
  stats: () => [...refundQueryKeys.all, 'stats'],
  details: () => [...refundQueryKeys.all, 'detail'],
  detail: (id: string) => [...refundQueryKeys.details(), id],
  pagination: (page: number) => [...refundQueryKeys.all, 'pagination', page],
  infinite: () => [...refundQueryKeys.all, 'infinite'],
};