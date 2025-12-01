import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { server } from "../../mocks/server";
import data from "../../routes/data.json";

import { AppointmentForm } from "./AppointmentForm";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const user = userEvent.setup();

describe("AppointmentForm", () => {
  const testProps = {
    assistantName: "assistantName",
    clientName: "clientName",
    serviceName: "serviceName",
    time: new Date("2025-11-30T16:20:57.842Z").toISOString(),
    services: [],
  };

  it("should show assistantName field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentForm values={testProps} onSubmit={() => {}} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByLabelText("appointments.detail.assistantName")).toBeInTheDocument();
      expect(screen.queryByTestId("assistant-name-input")).toBeDisabled();
      expect(screen.queryByTestId("assistant-name-input")).toHaveValue(
        testProps.assistantName,
      );
    });
  });

  it("should show time field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentForm values={testProps} onSubmit={() => {}} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByLabelText("appointments.detail.time")).toBeInTheDocument();
      expect(screen.queryByTestId("time-input")).toBeDisabled();
      expect(screen.queryByTestId("time-input")).toHaveValue(testProps.time);
    });
  });

  it("should show client field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentForm values={testProps} onSubmit={() => {}} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByLabelText("appointments.detail.client")).toBeInTheDocument();
      expect(screen.queryByTestId("client-name-input")).toBeInTheDocument();
      expect(
        screen.queryByTestId("client-name-input")?.querySelector("input"),
      ).toHaveValue(testProps.clientName);
    });
  });

  describe("service field", () => {
    it("should show service label with button", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AppointmentForm values={testProps} onSubmit={() => {}} />
        </QueryClientProvider>,
      );

      expect(screen.queryByText("appointments.detail.service")).toBeInTheDocument();
      expect(screen.queryByText("appointments.detail.addService")).toBeInTheDocument();
    });

    it("should show modal with services list", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AppointmentForm values={testProps} onSubmit={() => {}} />
        </QueryClientProvider>,
      );

      await user.click(screen.getByText("appointments.detail.addService"));

      await waitFor(() => {
        expect(screen.getByTestId("services-modal")).toBeInTheDocument();
        expect(screen.getByText("appointments.detail.services")).toBeInTheDocument();
        expect(screen.queryAllByTestId("services-list-item").length).toEqual(
          data.services.length,
        );
      });
    });

    it("should add service onto form", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AppointmentForm values={testProps} onSubmit={() => {}} />
        </QueryClientProvider>,
      );

      expect(
        screen.queryAllByTestId("services-container-list-item").length,
      ).toEqual(0);

      await user.click(screen.getByText("appointments.detail.addService"));

      expect(screen.getByTestId("services-modal")).toBeInTheDocument();
      expect(screen.getByText("appointments.detail.services")).toBeInTheDocument();

      const item = screen.queryAllByTestId("services-list-item")[0];
      const button = item.querySelector("button");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button);

      screen.getByLabelText("common.closeModal").click();

      await waitFor(async () => {
        expect(screen.queryByTestId("services-modal")).toBeNull();
        expect(
          screen.queryAllByTestId("services-container-list-item").length,
        ).toEqual(1);
        expect(
          screen.queryByTestId("form-duration")?.querySelector("b"),
        ).toHaveTextContent(`${data.services[0].duration} common.min`);
        expect(
          screen.queryByTestId("form-price")?.querySelector("b"),
        ).toHaveTextContent(`€${data.services[0].price}`);
      });
    });
  });
});
