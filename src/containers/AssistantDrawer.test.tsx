import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AssistantDrawer from "./AssistantDrawer";

const user = userEvent.setup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockNavigate = vi.fn();
const mockUseParams = vi.fn().mockReturnValue({
  assistantId: "assistant-123",
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

describe("AssistantDrawer", () => {
  it("should render header title", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssistantDrawer>
          <p>Content</p>
        </AssistantDrawer>
      </QueryClientProvider>,
    );

    expect(screen.getByText("assistants.assistant")).toBeInTheDocument();
  });

  it("should render header title with functional close button", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssistantDrawer>
          <p>Content</p>
        </AssistantDrawer>
      </QueryClientProvider>,
    );

    const closeButton = await screen.findByLabelText("common.closeDrawer");

    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: `/assistants`,
    });
  });

  it("should render assistant drawer content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssistantDrawer>
          <p>Content</p>
        </AssistantDrawer>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should ensure that overlay has functional close button", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssistantDrawer>
          <p>Content</p>
        </AssistantDrawer>
      </QueryClientProvider>,
    );

    const overlay = await screen.findByTestId("drawer-overlay");

    await user.click(overlay);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: `/assistants`,
    });
  });
});
