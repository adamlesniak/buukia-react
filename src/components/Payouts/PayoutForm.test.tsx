import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { server } from "../../mocks/server";

import { PayoutForm } from "./PayoutForm";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const user = userEvent.setup();

describe("PayoutForm", () => {
  const testProps = {
    amount: "12323",
    description: "testDescription",
    statementDescription: "testStatementDescription",
    bankAccountId: "testBankAccountId",
    method: "instant",
  };

  it("should show name field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PayoutForm
          bankAccounts={[]}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("transactions.payouts.detail.amount"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("payout-amount-input")).not.toBeDisabled();
      expect(screen.queryByTestId("payout-amount-input")).toHaveValue(
        testProps.amount,
      );
    });
  });

  it("should show description field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PayoutForm
          bankAccounts={[]}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payouts.detail.description"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("payout-description-input"),
      ).not.toBeDisabled();
      expect(screen.queryByTestId("payout-description-input")).toHaveValue(
        testProps.description,
      );
    });
  });

  it("should show errors", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PayoutForm
          onSubmit={() => {}}
          values={{
            amount: "0",
            description: "testDescription",
            bankAccountId: "testBankAccountId",
            method: "instant",
          }}
          bankAccounts={[]}
          isLoading={false}
        />
      </QueryClientProvider>,
    );

    await user.click(screen.getByText("common.submit"));

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payouts.form.errors.amountError"),
      ).toBeInTheDocument();
    });
  });
});
