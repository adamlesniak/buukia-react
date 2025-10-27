import { HttpResponse, http } from "msw";
import data from '../routes/data.json'


// Account Wide
// /api/appointments
// /api/assistants
// /api/payments
// /api/settings

export const handlers = [
  http.get("/api/services", () => HttpResponse.json(data.services)),
];
