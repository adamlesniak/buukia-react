import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import { server } from "../../mocks/server";
import data from "../../routes/data.json";

import { AppointmentDetail } from "./AppointmentDetail";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("AppointmentDetail", () => {
  const props = {
    appointment: data.appointments[0],
    services: data.services,
    clients: data.clients,
    onFormSubmit: vi.fn(),
    onClientSearch: vi.fn(),
    onServicesSearch: vi.fn(),
    todaysAppointments: [],
    isLoading: false,
  };

  it("display the appointment form", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentDetail {...props} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("common.loading")).not.toBeInTheDocument();
    });
  });
});
