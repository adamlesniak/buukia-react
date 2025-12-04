import { HttpResponse, http } from "msw";
import { v4 as uuidv4 } from "uuid";

import type {
  BuukiaAppointment,
  BuukiaAssistant,
  BuukiaClient,
  BuukiaService,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "@/types";

import { createAppointment } from "../../scripts/mocks";
import data from "../routes/data.json";

// Account Wide
// /api/appointments
// /api/assistants
// /api/payments
// /api/settings

const [assistants, clients, services, appointments]: [
  Map<string, BuukiaAssistant>,
  Map<string, BuukiaClient>,
  Map<string, BuukiaService>,
  Map<string, BuukiaAppointment>,
] = [
  new Map(data.assistants.map((assistant) => [assistant.id, assistant])),
  new Map(data.clients.map((client) => [client.id, client])),
  new Map(data.services.map((service) => [service.id, service])),
  new Map(
    data.appointments.map((appointment) => [appointment.id, appointment]),
  ),
];

export const handlers = [
  http.get("/api/services", () =>
    HttpResponse.json(Array.from(services.values())),
  ),

  http.get("/api/assistants", () =>
    HttpResponse.json(Array.from(assistants.values())),
  ),
  http.get("/api/assistants/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = assistants.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Assistant not found" },
        { status: 404 },
      );
    }
  }),

  http.post<never, CreateAppointmentBody>(
    "/api/appointments",
    async ({ request }) => {
      const body = await request.json();

      const id = uuidv4();

      if (!clients.get(body.clientId)) {
        throw Error("Client does not exist");
      }

      if (!assistants.get(body.assistantId)) {
        throw Error("Assistant does not exist");
      }

      for (const service of body.serviceIds) {
        if (!services.get(service)) {
          throw Error("Service does not exist");
        }
      }

      const item = createAppointment(data.assistants, data.clients);
      const appointment = {
        ...item,
        id,
        assistant: assistants.get(body.assistantId),
        client: clients.get(body.clientId),
        services: body.serviceIds.map((serviceId) => services.get(serviceId)),
      } as BuukiaAppointment;
      appointments.set(id, appointment);

      return HttpResponse.json(appointment);
    },
  ),
  http.put<never, UpdateAppointmentBody>(
    "/api/appointments",
    async ({ request }) => {
      const body = await request.json();

      if (!clients.get(body.clientId)) {
        throw Error("Client does not exist");
      }

      if (!assistants.get(body.assistantId)) {
        throw Error("Assistant does not exist");
      }

      for (const service of body.serviceIds) {
        if (!services.get(service)) {
          throw Error("Service does not exist");
        }
      }

      const item = createAppointment(data.assistants, data.clients);
      const appointment = {
        ...item,
        id: body.id,
        assistant: assistants.get(body.assistantId),
        client: clients.get(body.clientId),
        services: body.serviceIds.map((serviceId) => services.get(serviceId)),
      } as BuukiaAppointment;
      appointments.set(body.id, appointment);

      return HttpResponse.json(appointment);
    },
  ),
  http.delete<never, UpdateAppointmentBody>(
    "/api/appointments",
    async ({ request }) => {
      const body = await request.json();

      const item = appointments.get(body.id);

      if (!item) {
        throw Error("Appointment does not exist");
      }

      appointments.delete(body.id);

      return HttpResponse.json(item);
    },
  ),

  http.get("/api/clients", ({ request }) => {
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    return HttpResponse.json(Array.from(clients.values()).slice(0, limit));
  }),
  http.get("/api/clients/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = clients.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Client not found" },
        { status: 404 },
      );
    }
  }),

  // http.get("/api/appointments", () => HttpResponse.json(data.appointments)),
  // http.get("/api/payments", () => HttpResponse.json(data.payments)),
  // http.get("/api/settings", () => HttpResponse.json(data.settings)),
];
