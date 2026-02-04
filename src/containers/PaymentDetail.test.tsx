import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import lookup from "country-code-lookup";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns/format";

import { useCharge } from "@/api";
import { centsToFixed, getTimelineFromCharge } from "@/utils";
import { createStripeDispute, type StripeCharge } from "scripts/mocksStripe";

import data from "../routes/data-stripe.json";

// Mock the API hooks
vi.mock("@/api", async () => ({
  useCharge: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  createFileRoute: (_path: string) => (options: unknown) => ({
    useParams: mockUseParams,
    options,
  }),
  Outlet: () => <div data-testid="outlet" />,
  lazyRouteComponent: vi.fn(),
  Link: vi.fn(),
}));

const mockCharge = {
  ...data.charges[0],
  dispute: createStripeDispute(),
} as StripeCharge;

// Create test data
const mockUseCharge = useCharge as unknown as ReturnType<typeof vi.fn>;

// Import the component after mocking
const PaymentDetail = await import("./PaymentDetail");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("PaymentDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      payoutId: undefined,
    });

    // Default mock implementations
    mockUseCharge.mockReturnValue({
      data: mockCharge,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    });
  });

  describe("PaymentDetail", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PaymentDetail.default />
        </QueryClientProvider>,
      );

      expect(
        screen.queryByText(
          [
            getSymbolFromCurrency(mockCharge.currency),
            centsToFixed(mockCharge.amount),
          ].join(""),
          { ignore: "div,p" },
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          ["common.by", mockCharge.billing_details.email].join(" "),
        ),
      ).toBeInTheDocument();
    });

    it("should ensure that overlay has functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PaymentDetail.default />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/transactions/payments`,
      });
    });
  });

  describe("Summary", () => {
    beforeEach(() => {
      // Mock route params
      mockUseParams.mockReturnValue({
        payoutId: "appointmentId",
      });
    });

    it("should show payments details", () => {
      mockUseParams.mockReturnValue({
        payoutId: "testPaymentId",
      });
      mockUseCharge.mockReturnValue({
        data: {
          ...mockCharge,
          dispute: false,
        },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PaymentDetail.default />
        </QueryClientProvider>,
      );

      expect(
        screen.queryByText("transactions.payments.summary.sourceId"),
      ).toBeInTheDocument();
      expect(screen.queryByText(mockCharge.id)).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.summary.amount"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("summary-item-amount")).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.summary.description"),
      ).toBeInTheDocument();
      expect(screen.queryByText(mockCharge.description)).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.summary.status"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          `common.status.${mockCharge.status}`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.summary.paymentMethod.card"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          `**** **** **** ${mockCharge.payment_method_details.card.last4}`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.summary.paymentMethod.type"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          [
            mockCharge.payment_method_details.card.brand,
            mockCharge.payment_method_details.card.funding,
          ].join(" "),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          "transactions.payments.summary.paymentMethod.amountAuthorized",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("authorized-amount")).toBeInTheDocument();
      expect(
        screen.queryByText(
          "transactions.payments.summary.paymentMethod.expiry",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          [
            mockCharge.payment_method_details.card.exp_month,
            mockCharge.payment_method_details.card.exp_year,
          ].join("/"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          "transactions.payments.summary.paymentMethod.country",
        ),
      ).toBeInTheDocument();
      // expect(
      //   screen.queryByText(
      //     lookup.byFips(
      //       mockCharge.payment_method_details.card.country as string,
      //     )?.country as string,
      //   ),
      // ).toBeInTheDocument();
      expect(
        screen.queryByText(
          "transactions.payments.summary.paymentMethod.fingerprint",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockCharge.payment_method_details.card.fingerprint),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          "transactions.payments.summary.paymentMethod.checks.cvcCheck",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          mockCharge.payment_method_details.card.checks.cvc_check,
        ),
      ).toBeInTheDocument();
    });

    it("should show payments disputed details", () => {
      mockUseCharge.mockReturnValue({
        data: {
          ...mockCharge,
          dispute: true,
        },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PaymentDetail.default />
        </QueryClientProvider>,
      );

      expect(
        screen.queryByText("transactions.payments.summary.status"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.common.disputed"),
      ).toBeInTheDocument();
    });

    describe("should show dispute details", () => {
      it("should show dispute status", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByTestId(`dispute-summary-item-status`),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `transactions.payments.status.${mockCharge.dispute?.status}`,
            { selector: '[data-testid="dispute-summary-item-status"]' },
          ),
        ).toBeInTheDocument();
      });

      it("should show dispute status code", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByText(
            `transactions.payments.disputes.${mockCharge.dispute?.network_reason_code}`,
          ),
        ).toBeInTheDocument();
      });

      it("should show dispute details", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByText(
            [
              `transactions.payments.common.disputedFor`,
              [
                getSymbolFromCurrency(mockCharge.dispute?.currency || ""),
                centsToFixed(mockCharge.dispute?.amount || 0),
              ].join(""),
            ].join(" "),
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payments.common.status"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `transactions.payments.status.${mockCharge.dispute?.status}`,
            { selector: "p" },
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payments.common.reason"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `transactions.payments.reason.${mockCharge.dispute?.reason}`,
            { selector: "p" },
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payments.common.fee"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            [
              getSymbolFromCurrency(mockCharge.dispute?.currency || ""),
              centsToFixed(mockCharge.dispute?.amount || 0),
            ].join(""),
            { selector: "p" },
          ),
        ).toBeInTheDocument();
      });

      // it("should show dispute item header", () => {
      //   render(
      //     <QueryClientProvider client={queryClient}>
      //       <PaymentDetail.default />
      //     </QueryClientProvider>,
      //   );

      //   expect(
      //     screen.queryByText(
      //       `transactions.payments.common.disputedFor ${[
      //         getSymbolFromCurrency(mockCharge.dispute?.currency || ""),
      //         centsToFixed(mockCharge.dispute?.amount || 0),
      //       ].join("")}`,
      //     ),
      //   ).toBeInTheDocument();
      // });
    });

    describe("timeline", () => {
      it("should show payment timeline section", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        expect(screen.queryByText("common.timeline")).toBeInTheDocument();
      });

      it("should show payment timeline items", () => {
        const items = getTimelineFromCharge(mockCharge as StripeCharge);

        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        for (const [index, item] of items.entries()) {
          expect(
            screen.queryByText(item.name, { ignore: "h3" }),
          ).toBeInTheDocument();
          expect(
            screen.queryByText(format(new Date(item.date), "dd LLL, hh:mm a"), {
              selector: `[data-testid='timeline-item-${index}'] small`,
            }),
          ).toBeInTheDocument();
        }
      });
    });

    describe("actions and modals", () => {
      it("should show refund button", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByText("transactions.payments.actions.refund"),
        ).toBeInTheDocument();
      });
    });
    // it("should show summary title with create date when payout is not completed", () => {
    //   mockUsePayment.mockReturnValue({
    //     data: {
    //       ...mockPayment,
    //       status: PaymentStatus.Pending,
    //     },
    //     error: null,
    //     isLoading: false,
    //   });
    //   mockUseParams.mockReturnValue({
    //     payoutId: "testPaymentId",
    //   });

    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <PaymentDetail.default />
    //     </QueryClientProvider>,
    //   );

    //   expect(
    //     screen.queryByText(
    //       [
    //         getSymbolFromCurrency(mockPayment.currency),
    //         centsToFixed(mockPayment.amount),
    //       ].join(""),
    //       { ignore: "span" },
    //     ),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByTestId(`summary-item-title-status`),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(
    //       `transactions.payouts.createdAt ${format(new Date(mockPayment.arrivalDate), "PPPp")}`,
    //     ),
    //   ).toBeInTheDocument();
    // });

    // it("should show summary items", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <PaymentDetail.default />
    //     </QueryClientProvider>,
    //   );

    //   // Labels
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.destination"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.sourceId"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.amount"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.arrivalDate"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.description"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(
    //       "transactions.payouts.summary.statementDescription",
    //     ),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.method"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.status"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.summary.instantPaymentFee"),
    //   ).toBeInTheDocument();

    //   // Values
    //   expect(screen.queryByText(mockPayment.destination)).toBeInTheDocument();
    //   expect(screen.queryByText(mockPayment.sourceId)).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(
    //       [
    //         getSymbolFromCurrency(mockPayment.currency),
    //         centsToFixed(mockPayment.amount),
    //       ].join(""),
    //       {
    //         ignore: "h2",
    //       },
    //     ),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(
    //       format(new Date(mockPayment.arrivalDate), "dd/LL/yyyy, hh:mm a"),
    //     ),
    //   ).toBeInTheDocument();
    //   expect(screen.queryByText(mockPayment.description)).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(mockPayment.statement_description),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(`transactions.payouts.method.${mockPayment.type}`),
    //   ).toBeInTheDocument();
    //   expect(screen.queryByTestId(`summary-item-status`)).toBeInTheDocument();
    //   expect(
    //     screen.queryByText(
    //       [
    //         getSymbolFromCurrency(mockPayment.currency),
    //         centsToFixed(mockPayment.fee?.amount || 0),
    //       ].join(""),
    //       {
    //         ignore: "h2",
    //       },
    //     ),
    //   ).toBeInTheDocument();
    // });

    // it("should show actions for payouts in PENDING status", async () => {
    //   mockUsePayment.mockReturnValue({
    //     data: {
    //       ...mockPayment,
    //       status: PaymentStatus.Pending,
    //     },
    //     error: null,
    //     isLoading: false,
    //   });

    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <PaymentDetail.default />
    //     </QueryClientProvider>,
    //   );

    //   expect(screen.queryByText("common.actions")).toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.actions.cancel"),
    //   ).toBeInTheDocument();
    // });

    // it("should remove service following by confirmation dialog", async () => {
    //   mockUsePayment.mockReturnValue({
    //     data: {
    //       ...mockPayment,
    //       status: PaymentStatus.Pending,
    //     },
    //     error: null,
    //     isLoading: false,
    //   });
    //   mockUseCancelPayment.mockReturnValue({
    //     mutate: mockMutateCancel,
    //   });
    //   mockUseParams.mockReturnValue({
    //     payoutId: "testPaymentId",
    //   });

    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <PaymentDetail.default />
    //     </QueryClientProvider>,
    //   );

    //   await user.click(
    //     screen.getByText("transactions.payouts.actions.cancel"),
    //   );

    //   expect(
    //     screen.getByText("transactions.payouts.modal.cancelTitle"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.getByText("transactions.payouts.modal.cancelMessage"),
    //   ).toBeInTheDocument();

    //   await user.click(
    //     screen.queryAllByText("transactions.payouts.actions.cancel")[1],
    //   );

    //   expect(
    //     screen.queryByText("transactions.payouts.modal.cancelTitle"),
    //   ).not.toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.modal.cancelMessage"),
    //   ).not.toBeInTheDocument();
    //   expect(mockMutateCancel).toHaveBeenCalledWith("testPaymentId", {
    //     onSuccess: expect.any(Function),
    //   });
    // });

    // it("should not remove service following by confirmation dialog", async () => {
    //   mockUsePayment.mockReturnValue({
    //     data: {
    //       ...mockPayment,
    //       status: PaymentStatus.Pending,
    //     },
    //     error: null,
    //     isLoading: false,
    //   });
    //   mockUseCancelPayment.mockReturnValue({
    //     mutate: mockMutateCancel,
    //   });

    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <PaymentDetail.default />
    //     </QueryClientProvider>,
    //   );

    //   await user.click(
    //     screen.getByText("transactions.payouts.actions.cancel"),
    //   );

    //   expect(
    //     screen.getByText("transactions.payouts.modal.cancelTitle"),
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.getByText("transactions.payouts.modal.cancelMessage"),
    //   ).toBeInTheDocument();

    //   await user.click(screen.getByText("common.cancel", { exact: true }));

    //   expect(
    //     screen.queryByText("transactions.payouts.modal.cancelTitle"),
    //   ).not.toBeInTheDocument();
    //   expect(
    //     screen.queryByText("transactions.payouts.modal.cancelMessage"),
    //   ).not.toBeInTheDocument();
    //   expect(mockMutateCancel).not.toHaveBeenCalled();
    // });
  });
});
