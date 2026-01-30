import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns/format";

import {
  useCreatePayout,
  usePayout,
  usePayoutsStats,
  useCancelPayout,
} from "@/api";
import type { BuukiaPayout } from "@/types";
import { centsToFixed, PayoutStatus } from "@/utils";

// Mock the API hooks
vi.mock("@/api", async () => ({
  useCreatePayout: vi.fn(),
  useCancelPayout: vi.fn(),
  usePayout: vi.fn(),
  usePayoutsStats: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockMutate = vi.fn().mockImplementation((_data, { onSuccess }) => {
  onSuccess();
});
const mockMutateDelete = vi.fn();
const mockRouterState = vi.fn().mockReturnValue("daily");

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  createFileRoute: (_path: string) => (options: unknown) => ({
    useParams: mockUseParams,
    options,
  }),
  Outlet: () => <div data-testid="outlet" />,
  lazyRouteComponent: vi.fn(),
  useRouterState: mockRouterState,
  Link: vi.fn(),
}));

const mockPayout: BuukiaPayout = {
  id: "appointmentId",
  arrivalDate: "2025-12-14T10:00:00.000Z",
  createdAt: "2025-12-14T10:00:00.000Z",
  currency: "EUR",
  amount: 137,
  description: "testDescription",
  statement_description: "BUUKIA",
  destination: "ba_testId",
  provider: "stripe",
  sourceId: "ch_testId",
  status: PayoutStatus.Paid,
  fee: {
    rate: 0.01,
    amount: 100,
  },
  type: "bank_account",
};

// Create test data
const mockUsePayout = usePayout as unknown as ReturnType<typeof vi.fn>;
const mockUsePayoutsStats = usePayoutsStats as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCreatePayout = useCreatePayout as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCancelPayout = useCancelPayout as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const PayoutDetail = await import("./PayoutDetail");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("PayoutDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();
    mockMutateDelete.mockClear();
    mockRouterState.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      payoutId: undefined,
    });

    // Default mock implementations
    mockUsePayoutsStats.mockReturnValue({
      data: {
        totalPayouts: 1000,
        totalAmount: 50,
        averagePayout: 40,
        failed: 0,
      },
      error: null,
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    });
    mockUsePayout.mockReturnValue({
      data: mockPayout,
      error: null,
      isLoading: false,
    });
    mockUseCreatePayout.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseCancelPayout.mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe("PayoutDetail", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PayoutDetail.default />
        </QueryClientProvider>,
      );

      expect(
        screen.getByText("transactions.payouts.detail.title"),
      ).toBeInTheDocument();
    });

    it("should ensure that overlay has functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PayoutDetail.default />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/transactions/payouts`,
      });
    });

    describe("Summary", () => {
      beforeEach(() => {
        // Mock route params
        mockUseParams.mockReturnValue({
          payoutId: "appointmentId",
        });
      });

      it("should show summary title", () => {
        mockUsePayout.mockReturnValue({
          data: {
            ...mockPayout,
            status: PayoutStatus.Completed,
          },
          error: null,
          isLoading: false,
        });
        mockUseParams.mockReturnValue({
          payoutId: "testPayoutId",
        });

        render(
          <QueryClientProvider client={queryClient}>
            <PayoutDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByText(
            [
              getSymbolFromCurrency(mockPayout.currency),
              centsToFixed(mockPayout.amount),
            ].join(""),
            { ignore: "span" },
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`summary-item-title-status`),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `transactions.payouts.completedAt ${format(new Date(mockPayout.arrivalDate), "PPPp")}`,
            {
              selector: "small",
            },
          ),
        ).toBeInTheDocument();
      });

      it("should show summary title with create date when payout is not completed", () => {
        mockUsePayout.mockReturnValue({
          data: {
            ...mockPayout,
            status: PayoutStatus.Pending,
          },
          error: null,
          isLoading: false,
        });
        mockUseParams.mockReturnValue({
          payoutId: "testPayoutId",
        });

        render(
          <QueryClientProvider client={queryClient}>
            <PayoutDetail.default />
          </QueryClientProvider>,
        );

        expect(
          screen.queryByText(
            [
              getSymbolFromCurrency(mockPayout.currency),
              centsToFixed(mockPayout.amount),
            ].join(""),
            { ignore: "span" },
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`summary-item-title-status`),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `transactions.payouts.createdAt ${format(new Date(mockPayout.arrivalDate), "PPPp")}`,
          ),
        ).toBeInTheDocument();
      });

      it("should show summary items", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <PayoutDetail.default />
          </QueryClientProvider>,
        );

        // Labels
        expect(
          screen.queryByText("transactions.payouts.summary.destination"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.sourceId"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.amount"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.arrivalDate"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.description"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            "transactions.payouts.summary.statementDescription",
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.method"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.status"),
        ).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.summary.instantPayoutFee"),
        ).toBeInTheDocument();

        // Values
        expect(screen.queryByText(mockPayout.destination)).toBeInTheDocument();
        expect(screen.queryByText(mockPayout.sourceId)).toBeInTheDocument();
        expect(
          screen.queryByText(
            [
              getSymbolFromCurrency(mockPayout.currency),
              centsToFixed(mockPayout.amount),
            ].join(""),
            {
              ignore: "h2",
            },
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            format(new Date(mockPayout.arrivalDate), "dd/LL/yyyy, hh:mm a"),
          ),
        ).toBeInTheDocument();
        expect(screen.queryByText(mockPayout.description)).toBeInTheDocument();
        expect(
          screen.queryByText(mockPayout.statement_description),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(`transactions.payouts.method.${mockPayout.type}`),
        ).toBeInTheDocument();
        expect(screen.queryByTestId(`summary-item-status`)).toBeInTheDocument();
        expect(
          screen.queryByText(
            [
              getSymbolFromCurrency(mockPayout.currency),
              centsToFixed(mockPayout.fee?.amount || 0),
            ].join(""),
            {
              ignore: "h2",
            },
          ),
        ).toBeInTheDocument();
      });

      it("should show actions for payouts in PENDING status", async () => {
        mockUsePayout.mockReturnValue({
          data: {
            ...mockPayout,
            status: PayoutStatus.Pending,
          },
          error: null,
          isLoading: false,
        });

        render(
          <QueryClientProvider client={queryClient}>
            <PayoutDetail.default />
          </QueryClientProvider>,
        );

        expect(screen.queryByText("common.actions")).toBeInTheDocument();
        expect(
          screen.queryByText("transactions.payouts.actions.cancel"),
        ).toBeInTheDocument();
      });
    });
  });
});
