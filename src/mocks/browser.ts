import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";
import { handlersStripe } from "./handlers-stripe";

export const worker = setupWorker(...[...handlers, ...handlersStripe]);
