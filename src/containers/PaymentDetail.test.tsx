import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import lookup from "country-code-lookup";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns/format";

import { useCharge, useCreateRefund } from "@/api";
import { centsToFixed, getTimelineFromCharge } from "@/utils";
import { createStripeDispute, type StripeCharge } from "scripts/mocksStripe";

import data from "../routes/data-stripe.json";

// Mock the API hooks
vi.mock("@/api", async () => ({
  useCharge: vi.fn(),
  useCreateRefund: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockMutate = vi
  .fn()
  .mockImplementation((_data: unknown, options: unknown) => {
    if (options && typeof options === "object" && "onSuccess" in options) {
      (options as { onSuccess: () => void }).onSuccess();
    }
  });

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
  amount: 8888,
  dispute: createStripeDispute(),
} as StripeCharge;

// Create test data
const mockUseCharge = useCharge as unknown as ReturnType<typeof vi.fn>;
const mockUseCreateRefund = useCreateRefund as unknown as ReturnType<
  typeof vi.fn
>;

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
    mockMutate.mockClear();

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

    mockUseCreateRefund.mockReturnValue({
      mutate: mockMutate,
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
        screen.queryByText(`common.status.${mockCharge.status}`),
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

      it('should show modal with title "Refund payment" when clicking refund button', async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        const refundButton = screen.queryByText(
          "transactions.payments.actions.refund",
        );

        await user.click(refundButton!);

        expect(
          screen.queryByText("transactions.payments.modal.refundTitle"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payments.modal.refundDescription"),
        ).toBeInTheDocument();
      });

      it("should show modal anmd submit form using sample data", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PaymentDetail.default />
          </QueryClientProvider>,
        );

        const refundButton = screen.queryByText(
          "transactions.payments.actions.refund",
        );

        await user.click(refundButton!);

        const amountInput = screen.getByTestId(
          "refund-amount-input",
        ) as HTMLInputElement;
        const reasonInput = screen.getByTestId(
          "refund-reason-input",
        ) as HTMLSelectElement;
        const descriptionInput = screen.getByTestId(
          "refund-description-input",
        ) as HTMLTextAreaElement;

        await user.selectOptions(reasonInput, "duplicate");
        await user.type(descriptionInput, "Test refund description");

        await user.click(screen.getByTestId("confirm-refund-button")!);

        expect(amountInput).toHaveValue("88.88");
        expect(reasonInput).toHaveValue("duplicate");
        expect(descriptionInput).toHaveValue("Test refund description");
        expect(mockMutate).toHaveBeenCalledWith(
          {
            charge: mockCharge.id,
            amount: mockCharge.amount,
            reason: "duplicate",
            payment_intent: null,
            metadata: {
              description: "Test refund description",
            },
          },
        );
      });
    });
  });
});
