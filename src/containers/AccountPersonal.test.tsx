import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";

import { useAccount, useUpdateAccount } from "@/api";

vi.mock("@/api", async () => ({
  useAccount: vi.fn(),
  useUpdateAccount: vi.fn(),
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

const mockAccount = {
  id: "f03ab9b8-635f-489e-aff0-509aa585f5ff",
  personal: {
    name: "Josiane Pagac",
    email: "Rex.Fritsch-Mayer39@gmail.com",
    dob: "2006-01-26T18:22:52.509Z",
    tel: "+34 232323232",
    thumbnail:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/24.jpg",
  },
  business: {
    name: "McKenzie - Hyatt",
    tax: { number: "tVwu8T9DZZ" },
    mobile: "+34 232323232",
    contact: {
      address: "60728 Kathryne Stravenue",
      city: "Port Clyde",
      municipality: "Alaska",
      postalCode: "41303",
      country: "RU",
    },
  },
};

const mockUseAccount = useAccount as unknown as ReturnType<typeof vi.fn>;
const mockUseUpdateAccount = useUpdateAccount as unknown as ReturnType<
  typeof vi.fn
>;
const mockMutate = vi.fn().mockImplementation((_data, { onSuccess }) => {
  onSuccess();
});
// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
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

// Import the component after mocking
const AccountPersonal = await import("./AccountPersonal");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("AccountPersonal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockMutate.mockClear();

    mockUseUpdateAccount.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseAccount.mockReturnValue({
      data: mockAccount,
    });
  });

  it("should display error when there is assistant error", async () => {
    mockUseAccount.mockReturnValueOnce({
      data: null,
      error: new Error("Account error"),
      isLoading: false,
      refetch: vi.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AccountPersonal.default />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("error.message")).toBeInTheDocument();
  });

  it("should display title and details", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AccountPersonal.default />
      </QueryClientProvider>,
    );

    expect(screen.queryByText("account.personal.title")).toBeInTheDocument();
    expect(screen.queryByText("account.personal.details")).toBeInTheDocument();
  });

  it("should populate form with expected values", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AccountPersonal.default />
      </QueryClientProvider>,
    );

    const nameInputElement = await (screen.queryByTestId(
      "name-input",
    ) as HTMLInputElement);
    const emailInputElement = await (screen.queryByTestId(
      "email-input",
    ) as HTMLInputElement);
    const dobInputElement = await (screen.queryByTestId(
      "dob-input",
    ) as HTMLInputElement);
    const telInputElement = await (screen.queryByTestId(
      "tel-input",
    ) as HTMLInputElement);

    expect(nameInputElement).toHaveValue(mockAccount.personal.name);
    expect(emailInputElement).toHaveValue(mockAccount.personal.email);
    expect(dobInputElement).toHaveValue(
      format(new Date(mockAccount.personal.dob).toISOString(), "dd/LL/yyyy"),
    );
    expect(telInputElement).toHaveValue("+34 232 323 232");
  });

  it("should update account using the mutate function", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AccountPersonal.default />
      </QueryClientProvider>,
    );

    const nameInputElement = await (screen.queryByTestId(
      "name-input",
    ) as HTMLInputElement);
    const emailInputElement = await (screen.queryByTestId(
      "email-input",
    ) as HTMLInputElement);
    const dobInputElement = await (screen.queryByTestId(
      "dob-input",
    ) as HTMLInputElement);
    const telInputElement = await (screen.queryByTestId(
      "tel-input",
    ) as HTMLInputElement);
    const submitButton = (await screen.queryByText(
      "common.submit",
    )) as HTMLElement;

    await user.click(submitButton);

    expect(nameInputElement).toHaveValue(mockAccount.personal.name);
    expect(emailInputElement).toHaveValue(mockAccount.personal.email);
    expect(dobInputElement).toHaveValue(
      format(new Date(mockAccount.personal.dob).toISOString(), "dd/LL/yyyy"),
    );
    expect(telInputElement).toHaveValue("+34 232 323 232");
    expect(mockMutate).toHaveBeenCalledWith(
      {
        name: mockAccount.personal.name,
        email: mockAccount.personal.email,
        dob: "26012006",
        tel: "0034232323232",
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });
  it("should display errors", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AccountPersonal.default />
      </QueryClientProvider>,
    );

    const nameInputElement = await (screen.queryByTestId(
      "name-input",
    ) as HTMLInputElement);
    const emailInputElement = await (screen.queryByTestId(
      "email-input",
    ) as HTMLInputElement);
    const dobInputElement = await (screen.queryByTestId(
      "dob-input",
    ) as HTMLInputElement);
    const telInputElement = await (screen.queryByTestId(
      "tel-input",
    ) as HTMLInputElement);

    await userEvent.type(nameInputElement, "John Doe");
    await userEvent.type(emailInputElement, "invalid-email");
    await userEvent.type(dobInputElement, "invalid-dob");
    await userEvent.clear(telInputElement);
    await userEvent.type(telInputElement, "23");

    const submitButton = (await screen.queryByText(
      "common.submit",
    )) as HTMLElement;

    await user.click(submitButton);

    expect(
      await screen.queryByText("account.detail.form.account.errors.email"),
    ).toBeInTheDocument();
    expect(
      await screen.queryByText("account.detail.form.account.errors.tel"),
    ).toBeInTheDocument();
  });
});
