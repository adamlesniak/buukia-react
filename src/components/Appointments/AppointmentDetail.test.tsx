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
  it("display the appointment form", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentDetail
          appointment={data.appointments[0]}
          services={data.services}
          clients={data.clients}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("common.loading")).not.toBeInTheDocument();
    });
  });
});
