// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const assistantQueryKeys = {
  all: ['assistants'],
  details: () => [...assistantQueryKeys.all, 'detail'],
  detail: (id: number) => [...assistantQueryKeys.details(), id],
  pagination: (page: number) => [...assistantQueryKeys.all, 'pagination', page],
  infinite: () => [...assistantQueryKeys.all, 'infinite'],
};