// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const serviceQueryKeys = {
  all: ['services'],
  details: () => [...serviceQueryKeys.all, 'detail'],
  detail: (id: string) => [...serviceQueryKeys.details(), id],
  pagination: (page: number) => [...serviceQueryKeys.all, 'pagination', page],
  infinite: () => [...serviceQueryKeys.all, 'infinite'],
};