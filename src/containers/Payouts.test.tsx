import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { usePayouts, usePayoutsStats } from "@/api";

import { server } from "../mocks/server";
import data from "../routes/data.json";

vi.mock("@/api", async () => ({
  usePayouts: vi.fn(),
  usePayoutsStats: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

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

const mockUsePayouts = usePayouts as unknown as ReturnType<typeof vi.fn>;
const mockUsePayoutsStats = usePayoutsStats as unknown as ReturnType<
  typeof vi.fn
>;

const Payouts = await import("./Payouts");

const user = userEvent.setup();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Payouts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();

    mockUsePayouts.mockReturnValue({
      data: data.payouts,
      error: null,
      isLoading: false,
    });

    mockUsePayoutsStats.mockReturnValue({
      data: {
        totalPayouts: 0,
        totalAmount: 0,
        averagePayout: 0,
        failed: 0,
      },
      error: null,
      isLoading: false,
    });
  });

  it("should show stats cards", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payouts.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payouts.cards.total"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.cards.averagePayout"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.cards.totalCount"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.cards.failed"),
      ).toBeInTheDocument();
    });
  });

  it("should show payouts title and amount of items", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payouts.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payouts.title"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(`${data.payouts.length} common.items`),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.date"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.amount"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.status"),
      ).toBeInTheDocument();
      data.payouts.forEach((payout) => {
        expect(screen.queryAllByText(payout.id)).toBeDefined();
        expect(screen.queryAllByText(payout.createdAt)).toBeDefined();
        expect(screen.queryAllByText(payout.amount)).toBeDefined();
        expect(screen.queryAllByText(payout.status)).toBeDefined();
        expect(screen.queryAllByText(payout.destination)).toBeDefined();
      });
    });
  });

  it("should show payouts id, date, amount, status, destination", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payouts.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payouts.table.date"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.amount"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.status"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payouts.table.destination"),
      ).toBeInTheDocument();
      data.payouts.forEach((payout) => {
        expect(screen.queryAllByText(payout.createdAt)).toBeDefined();
        expect(screen.queryAllByText(payout.amount)).toBeDefined();
        expect(screen.queryAllByText(payout.status)).toBeDefined();
        expect(screen.queryAllByText(payout.destination)).toBeDefined();
      });
    });
  });

  it("should navigate to specific payout on payout select", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payouts.default />
      </QueryClientProvider>,
    );

    const payoutRows = screen.queryAllByTestId("payout-row");

    await user.click(payoutRows[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/transactions/payouts/${data.payouts[0].id}`,
      });
    });
  });

  it("should show error in case of payouts error", async () => {
    const queryClient = new QueryClient();

    mockUsePayouts.mockReturnValue({
      data: data.payouts,
      error: new Error("Payouts error"),
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Payouts.default />
      </QueryClientProvider>,
    );

    const error = screen.queryByText("transactions.payouts.loadingError");

    expect(error).toBeInTheDocument();
  });
});
