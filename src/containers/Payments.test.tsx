import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { usePayments } from "@/api";

import { server } from "../mocks/server";
import data from "../routes/data.json";

vi.mock("@/api", async () => ({
  usePayments: vi.fn(),
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

const mockUsePayments = usePayments as unknown as ReturnType<typeof vi.fn>;

const Payments = await import("./Payments");

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

describe("Payments", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();

    mockUsePayments.mockReturnValue({
      data: data.payments,
      error: null,
      isLoading: false,
    });
  });

  it("should show payments id, date, amount, status", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payments.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("transactions.payments.table.id"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.table.date"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.table.amount"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("transactions.payments.table.status"),
      ).toBeInTheDocument();
      data.payments.forEach((payment) => {
        expect(screen.queryAllByText(payment.id)).toBeDefined();
        expect(screen.queryAllByText(payment.date)).toBeDefined();
        expect(screen.queryAllByText(payment.amount)).toBeDefined();
        expect(screen.queryAllByText(payment.status)).toBeDefined();
      });
    });
  });

  it("should navigate to specific payment on payment select", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Payments.default />
      </QueryClientProvider>,
    );

    const paymentRows = screen.queryAllByTestId("payment-row");

    await user.click(paymentRows[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/transactions/payments/${data.payments[0].id}`,
      });
    });
  });

  it("should show error in case of payments error", async () => {
    const queryClient = new QueryClient();

    mockUsePayments.mockReturnValue({
      data: data.payments,
      error: new Error("Payments error"),
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Payments.default />
      </QueryClientProvider>,
    );

    const error = screen.queryByText("transactions.payments.loadingError");

    expect(error).toBeInTheDocument();
  });
});
