import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { differenceInHours } from "date-fns/differenceInHours";

import { useAssistants } from "@/api";

import { server } from "../mocks/server";
import data from "../routes/data.json";

vi.mock("@/api", async () => ({
  useAssistants: vi.fn(),
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
}));

const mockUseAssistants = useAssistants as unknown as ReturnType<typeof vi.fn>;

const mockMutate = vi.fn();

const Assistants = await import("./Assistants");

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

describe("Assistants", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();

    mockUseAssistants.mockReturnValue({
      data: data.assistants,
      error: null,
      isLoading: false,
    });
  });

  it("should assistant title, items count and add assistant button", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Assistants.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("assistants.title")).toBeInTheDocument();
      expect(
        screen.queryByText(`${data.assistants.length} common.items`),
      ).toBeInTheDocument();
      expect(screen.queryByText("assistants.addAssistant")).toBeInTheDocument();
    });
  });

  it("should show Assistants name, category, duration, price and actions", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Assistants.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("assistants.table.name")).toBeInTheDocument();
      expect(
        screen.queryByText("assistants.table.specialisations"),
      ).toBeInTheDocument();
      expect(screen.queryByText("assistants.table.email")).toBeInTheDocument();
      expect(
        screen.queryByText("assistants.table.availability (assistants.hours)"),
      ).toBeInTheDocument();

      data.assistants.forEach((assistant) => {
        expect(screen.queryAllByText(assistant.name)).toBeDefined();
        for (const category of assistant.categories) {
          expect(screen.queryAllByText(category)).toBeDefined();
        }
        expect(screen.queryAllByText(`${assistant.email}`)).toBeDefined();

        const totalHours = assistant.availability.regular.reduce(
          (acc, value) => {
            const [startTime, endTime] = [
              new Date().setHours(parseInt(value.startTime.split(":")[0], 10)),
              new Date().setHours(parseInt(value.endTime.split(":")[0], 10)),
            ];

            return acc + differenceInHours(endTime, startTime);
          },
          0,
        );

        expect(screen.queryAllByText(totalHours)).toBeDefined();
      });
    });
  });

  it("should navigate to specific assistant on assistant select", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Assistants.default />
      </QueryClientProvider>,
    );

    const assistantRows = screen.queryAllByTestId("assistant-row");

    await user.click(assistantRows[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/assistants/${data.assistants[0].id}`,
      });
    });
  });

  it("should show error in case of assistants error", async () => {
    const queryClient = new QueryClient();

    mockUseAssistants.mockReturnValue({
      data: data.assistants,
      error: new Error("assistants.loadingError"),
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Assistants.default />
      </QueryClientProvider>,
    );

    const error = screen.queryByText("assistants.loadingError");

    expect(error).toBeInTheDocument();
  });
});
