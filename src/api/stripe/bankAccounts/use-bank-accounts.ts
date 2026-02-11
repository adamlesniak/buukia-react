import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import { type StripeBankAccount } from "@/types";

import { bankAccountQueryKeys } from "./bank-accounts-query-keys";

interface useBankAccountsParams {
  limit: number;
  query: string;
  customerId: string;
}

export const useBankAccounts = (params: useBankAccountsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<{
    object: "list";
    url: string;
    has_more: boolean;
    data: StripeBankAccount[];
  }>({
    queryKey: [...bankAccountQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/v1/customers/${params.customerId}/bank_accounts?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result.data as StripeBankAccount[]) {
        queryClient.setQueryData(bankAccountQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
