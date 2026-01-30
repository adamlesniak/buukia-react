import { faker } from "@faker-js/faker";
import { HttpResponse, http } from "msw";
import { v4 as uuidv4 } from "uuid";

import type {
  BuukiaAppointment,
  BuukiaAssistant,
  BuukiaCategory,
  BuukiaClient,
  BuukiaPayment,
  BuukiaPayout,
  BuukiaService,
  CreateAppointmentBody,
  CreateAssistantBody,
  CreatePayoutBody,
  CreateServiceBody,
  UpdateAppointmentBody,
  UpdateAssistantBody,
  UpdateCategoryBody,
  UpdateServiceBody,
} from "@/types";

import data from "../routes/data.json";

// Account Wide
// /api/appointments
// /api/assistants
// /api/payments
// /api/settings

const [
  payments,
  payouts,
  assistants,
  clients,
  services,
  appointments,
  categories,
]: [
  Map<string, BuukiaPayment>,
  Map<string, BuukiaPayout>,
  Map<string, BuukiaAssistant>,
  Map<string, BuukiaClient>,
  Map<string, BuukiaService>,
  Map<string, BuukiaAppointment>,
  Map<string, BuukiaCategory>,
] = [
  new Map(
    data.payments.map((payment) => [
      payment.id,
      payment as unknown as BuukiaPayment,
    ]),
  ),
  new Map(
    data.payouts.map((payout) => [
      payout.id,
      payout as unknown as BuukiaPayout,
    ]),
  ),
  new Map(data.assistants.map((assistant) => [assistant.id, assistant])),
  new Map(data.clients.map((client) => [client.id, client])),
  new Map(
    data.services.map((service) => [
      service.id,
      {
        ...service,
        duration: service.duration.toString(),
      },
    ]),
  ),
  new Map(
    data.appointments.map((appointment) => [
      appointment.id,
      {
        ...appointment,
        services: appointment.services.map((service) => ({
          ...service,
          duration: service.duration.toString(),
        })),
      },
    ]),
  ),
  new Map(data.categories.map((category) => [category.id, category])),
];

export const handlers = [
  http.get("/api/payments/stats", () => {
    return HttpResponse.json({
      totalPayments: Array.from(payments.values()).length,
      totalAmount: Array.from(payments.values()).reduce(
        (sum, payment) => sum + payment.amount,
        0,
      ),
      averagePayment:
        Array.from(payments.values()).reduce(
          (sum, payment) => sum + payment.amount,
          0,
        ) / Array.from(payments.values()).length,
      failed: 0,
    });
  }),

  http.get("/api/payments", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json(
      Array.from(payments.values())
        .filter((payment) =>
          payment.description
            .toLowerCase()
            .includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
  }),

  http.get("/api/payouts/stats", () => {
    return HttpResponse.json({
      totalPayouts: Array.from(payouts.values()).length,
      totalAmount: Array.from(payouts.values()).reduce(
        (sum, payout) => sum + payout.amount,
        0,
      ),
      averagePayout:
        Array.from(payouts.values()).reduce(
          (sum, payout) => sum + payout.amount,
          0,
        ) / Array.from(payouts.values()).length,
      failed: 0,
    });
  }),

  http.get("/api/payouts", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json(
      Array.from(payouts.values())
        .filter((payout) =>
          payout.description.toLowerCase().includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
  }),

  http.get("/api/payouts/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = payouts.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Payout not found" },
        { status: 404 },
      );
    }
  }),

  http.post("/api/payouts/:id/cancel", (req) => {
    const { id } = req.params as { id: string };

    const item = payouts.get(id);

    if (item) {
      const newItem: BuukiaPayout = {
        ...item,
        status: "canceled",
      };

      payouts.set(id, newItem);

      return HttpResponse.json(newItem);
    } else {
      return HttpResponse.json(
        { message: "Payout not found" },
        { status: 404 },
      );
    }
  }),

  http.post<never, CreatePayoutBody>("/api/payouts", async ({ request }) => {
    const body = await request.json();

    const id = uuidv4();

    const payout = {
      id,
      amount: body.amount,
      currency: "EUR",
      arrivalDate: "",
      createdAt: new Date().toISOString(),
      description: body.description,
      provider: "stripe",
      sourceId: `po_${faker.string.alphanumeric(24)}`,
      status: "pending",
      type: "bank_account",
      fee: {
        rate: 0.01,
        amount: Math.round(body.amount * 0.01),
      },
      statement_description: 'BUUKIA',
      destination: `ba_${faker.string.alphanumeric(24)}`,
    } as BuukiaPayout;

    payouts.set(id, payout);

    return HttpResponse.json(payout);
  }),

  http.get("/api/assistants", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json(
      Array.from(assistants.values())
        .filter((assistant) =>
          assistant.name.toLowerCase().includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
  }),

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

  http.post<never, CreateAssistantBody>(
    "/api/assistants",
    async ({ request }) => {
      const body = await request.json();

      const id = uuidv4();

      const assistant = {
        id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        categories: body.categories,
        availability: body.availability,
        holidays: body.holidays,
      } as BuukiaAssistant;
      assistants.set(id, assistant);

      return HttpResponse.json(assistant);
    },
  ),

  http.put<never, UpdateAssistantBody>(
    "/api/assistants/:id",
    async ({ request }) => {
      const body = await request.json();

      const item = assistants.get(body.id);
      if (!item) {
        throw new Error("Item not found");
      }

      const assistant = {
        id: item.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        categories: body.categories,
        availability: body.availability,
        holidays: body.holidays,
      } as BuukiaAssistant;
      assistants.set(item.id, assistant);

      return HttpResponse.json(assistant);
    },
  ),

  http.delete("/api/assistants/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = assistants.delete(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Assistant not found" },
        { status: 404 },
      );
    }
  }),

  http.get("/api/categories", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json(
      Array.from(categories.values())
        .filter((service) =>
          service.name.toLowerCase().includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
  }),

  http.get("/api/categories/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = categories.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }
  }),

  http.post<never, CreateServiceBody>(
    "/api/categories",
    async ({ request }) => {
      const body = await request.json();

      const id = uuidv4();

      const category = {
        id,
        name: body.name,
      } as BuukiaCategory;
      categories.set(id, category);

      return HttpResponse.json(category);
    },
  ),

  http.put<never, UpdateCategoryBody>(
    "/api/categories/:id",
    async ({ request }) => {
      const body = await request.json();

      const item = categories.get(body.id);
      if (!item) {
        throw new Error("Item not found");
      }

      const category = {
        id: item.id,
        name: body.name,
      } as BuukiaCategory;
      categories.set(item.id, category);

      return HttpResponse.json(category);
    },
  ),

  http.delete("/api/categories/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = categories.delete(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }
  }),

  http.get("/api/services", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    return HttpResponse.json(
      Array.from(services.values())
        .filter((service) =>
          service.name.toLowerCase().includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
  }),

  http.get("/api/services/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = services.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }
  }),

  http.post<never, CreateServiceBody>("/api/services", async ({ request }) => {
    const body = await request.json();

    const id = uuidv4();

    const service = {
      id,
      name: body.name,
      category: body.category,
      duration: body.duration,
      description: body.description,
      price: body.price,
    } as BuukiaService;
    services.set(id, service);

    return HttpResponse.json(service);
  }),

  http.put<never, UpdateServiceBody>(
    "/api/services/:id",
    async ({ request }) => {
      const body = await request.json();

      const item = services.get(body.id);

      if (!item) {
        throw new Error("Item not found");
      }

      const service = {
        id: item.id,
        name: body.name,
        category: body.category,
        duration: body.duration,
        description: body.description,
        price: body.price,
      } as BuukiaService;
      services.set(item.id, service);

      return HttpResponse.json(service);
    },
  ),

  http.delete("/api/services/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = services.delete(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }
  }),

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

  http.get("/api/appointments", async ({ request }) => {
    const url = new URL(request.url);

    const [assistantId, startDate, endDate] = [
      url.searchParams.get("assistantId"),
      url.searchParams.get("startDate"),
      url.searchParams.get("endDate"),
    ];

    const filteredAppointments = Array.from(appointments.values()).filter(
      (appointment) => {
        if (assistantId && appointment?.assistant?.id !== assistantId) {
          return false;
        }

        if (startDate) {
          const start = new Date(startDate);
          const appointmentDate = new Date(appointment.time);
          if (appointmentDate < start) {
            return false;
          }
        }

        if (endDate) {
          const end = new Date(endDate);
          const appointmentDate = new Date(appointment.time);
          if (appointmentDate > end) {
            return false;
          }
        }

        return true;
      },
    );

    return HttpResponse.json(
      filteredAppointments.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      }),
    );
  }),

  http.get("/api/appointments/:id", (req) => {
    const { id } = req.params as { id: string };

    const item = appointments.get(id);

    if (item) {
      return HttpResponse.json(item);
    } else {
      return HttpResponse.json(
        { message: "Appointment not found" },
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

      const appointment = {
        id,
        time: body.time,
        assistant: assistants.get(body.assistantId),
        client: clients.get(body.clientId),
        services: body.serviceIds
          .map((serviceId) => services.get(serviceId))
          .filter((service): service is BuukiaService => service !== undefined),
      } as BuukiaAppointment;
      appointments.set(id, appointment);

      return HttpResponse.json(appointment);
    },
  ),
  http.put<never, UpdateAppointmentBody>(
    "/api/appointments/:id",
    async ({ request }) => {
      const body = await request.json();
      // Use params.id or body.id

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

      const item = appointments.get(body.id);

      const appointment = {
        ...item,
        id: body.id,
        assistant: assistants.get(body.assistantId),
        client: clients.get(body.clientId),
        services: body.serviceIds
          .map((serviceId) => services.get(serviceId))
          .filter((service): service is BuukiaService => service !== undefined),
        payments: [],
      } as BuukiaAppointment;
      appointments.set(body.id, appointment);

      return HttpResponse.json(appointment);
    },
  ),

  http.delete<{ id: string }>("/api/appointments/:id", async ({ params }) => {
    const item = appointments.get(params.id);

    if (!item) {
      throw Error("Appointment does not exist");
    }

    appointments.delete(params.id);

    return HttpResponse.json(item);
  }),

  http.get("/api/clients", ({ request }) => {
    const [limitParam, query] = [
      new URL(request.url).searchParams.get("limit"),
      new URL(request.url).searchParams.get("query"),
    ];
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    return HttpResponse.json(
      Array.from(clients.values())
        .filter((client) =>
          client.name.toLowerCase().includes(query?.toLowerCase() || ""),
        )
        .slice(0, limit),
    );
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
