// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const clientQueryKeys = {
  all: ['clients'],
  details: () => [...clientQueryKeys.all, 'detail'],
  detail: (id: string) => [...clientQueryKeys.details(), id],
  pagination: (page: number) => [...clientQueryKeys.all, 'pagination', page],
  infinite: () => [...clientQueryKeys.all, 'infinite'],
};