import { HttpResponse, http } from "msw";

import data from '../routes/data.json'


// Account Wide
// /api/appointments
// /api/assistants
// /api/payments
// /api/settings

export const handlers = [
  http.get("/api/services", () => HttpResponse.json(data.services)),
  http.get("/api/assistants", () => HttpResponse.json(data.assistants)),
  // http.get("/api/appointments", () => HttpResponse.json(data.appointments)),
  // http.get("/api/payments", () => HttpResponse.json(data.payments)),
  // http.get("/api/settings", () => HttpResponse.json(data.settings)),
];
