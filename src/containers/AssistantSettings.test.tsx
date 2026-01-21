import { QueryClient } from "@tanstack/query-core";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "node_modules/@tanstack/react-query/build/modern/QueryClientProvider";

const AssistantSettings = await import("./AssistantSettings");

const mockUseParams = vi
  .fn()
  .mockReturnValue({ assistantId: "testAssistantId" });
const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});
describe("AssistantSettings", () => {
  describe("settings", () => {
    it("should render settings title", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.title")).toBeInTheDocument();
    });

    it("should render holidays setting", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.holidays.title")).toBeInTheDocument();
      expect(
        screen.getByText("settings.holidays.description"),
      ).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("should render actions title", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.actions.title")).toBeInTheDocument();
    });

    it("should render delete assistant button", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(
        screen.getByText("settings.actions.deleteAssistant"),
      ).toBeInTheDocument();
    });
  });
});
