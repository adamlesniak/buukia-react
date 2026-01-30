import { render, screen, waitFor } from "@testing-library/react";

import { server } from "../mocks/server";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("@tanstack/react-router", async () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  createFileRoute: (_path: string) => (options: unknown) => ({
    useParams: mockUseParams,
    options,
  }),
  Outlet: () => <div data-testid="outlet" />,
  lazyRouteComponent: vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const Transactions = await import("./Transactions");

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);
  });

  it("should show tabbed navigation", async () => {
    render(<Transactions.default />);

    await waitFor(() => {
      expect(screen.queryByText("common.payments")).toBeInTheDocument();
      expect(screen.queryByText("common.payouts")).toBeInTheDocument();
      expect(screen.queryByText("common.settings")).toBeInTheDocument();
    });
  });
});
