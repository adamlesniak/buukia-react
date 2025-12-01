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
  it("display the loading", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentDetail id="1" time={new Date().toISOString()} />
      </QueryClientProvider>,
    );

    const text = screen.getByText("common.loading");

    expect(text).toBeInTheDocument();
  });

  it("display the appointment form", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentDetail
          id={data.assistants[0].id}
          time={new Date().toISOString()}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("common.loading")).not.toBeInTheDocument();
    });
  });

  it("display the error message when assistant doesnt exist", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentDetail
          id="non-existent-id"
          time={new Date().toISOString()}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("common.error", { exact: false }),
      ).toBeInTheDocument();
    });
  });
});
