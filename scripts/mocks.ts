import * as fs from "node:fs";
import path from "node:path";

import { faker } from "@faker-js/faker";
import prettier from "prettier";

import type {
  BuukiaAppointment,
  BuukiaAssistant,
  BusinessCategory,
  BuukiaClient,
  MockData,
  BuukiaService,
} from "../src/types";

const serviceNames = [
  "Basic Haircut",
  "Professional Manicure",
  "Relaxing Pedicure",
  "Deep Tissue Massage",
  "Rejuvenating Facial",
  "Yoga Session",
];

const businessNames = [
  "Elegance Salon",
  "Urban Spa",
  "Glamour Studio",
  "Relaxation Haven",
];

const serviceCategories: BusinessCategory[] = [
  "Beauty",
  "Wellness",
  "Health",
  "Fitness",
];

export const createAssistant = (): BuukiaAssistant => {
  const [firstName, lastName] = [
    faker.person.firstName(),
    faker.person.lastName(),
  ];

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    initials: firstName[0] + lastName[0],
    availability: {
      regular: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }).map(
        () => ({
          dayOfWeek: faker.number.int({ min: 0, max: 6 }),
          startTime: "09:00",
          endTime: "17:00",
        }),
      ),
      exceptions: [],
      holidays: [],
    },
    business:
      businessNames[
        faker.number.int({ min: 0, max: businessNames.length - 1 })
      ],
    type: serviceCategories[
      faker.number.int({ min: 0, max: serviceCategories.length - 1 })
    ],
  };
};

export const createService = (): BuukiaService => {
  return {
    id: faker.string.uuid(),
    description: faker.lorem.sentence(),
    business:
      businessNames[
        faker.number.int({ min: 0, max: businessNames.length - 1 })
      ],
    category:
      serviceCategories[
        faker.number.int({ min: 0, max: serviceCategories.length - 1 })
      ],
    duration: faker.number.int({ min: 30, max: 120 }),
    name: serviceNames[
      faker.number.int({ min: 0, max: serviceNames.length - 1 })
    ],
    price: faker.number.int({ min: 20, max: 200 }),
  };
};

export const createClient = (): BuukiaClient => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    appointments: []
  };
};

export const createAppointment = (
  assistants: BuukiaAssistant[],
  clients: BuukiaClient[],
): BuukiaAppointment => {
  return {
    id: faker.string.uuid(),
    assistant:
      assistants[faker.number.int({ min: 0, max: assistants.length - 1 })],
    time: faker.date.between({ from: new Date(), to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }).toISOString(),
    client: clients[faker.number.int({ min: 0, max: clients.length - 1 })],
    services: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
      () => createService(),
    ),
  };
};

const [assistants, clients]: [BuukiaAssistant[], BuukiaClient[]] = [
  Array.from({ length: 10 }).map(() => createAssistant()),
  Array.from({ length: 20 }).map(() => createClient()),
];

const [services, appointments]: [BuukiaService[], BuukiaAppointment[]] = [
  Array.from({ length: serviceNames.length }).map(() => createService()),
  Array.from({ length: 10 }).map(() => createAppointment(assistants, clients)),
];

const main = async (): Promise<void> => {
  const data: MockData = {
    appointments,
    assistants,
    clients,
    services,
  };

  const formattedCode = await prettier.format(JSON.stringify(data), {
    parser: "json",
  });

  fs.writeFileSync(path.resolve("src/routes/data.json"), formattedCode);
  console.log("✅ Mock data generated successfully!");
};

main();
