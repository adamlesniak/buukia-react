import * as fs from "node:fs";
import path from "node:path";

import { faker } from "@faker-js/faker";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInDays,
  differenceInHours,
  roundToNearestMinutes,
  startOfDay,
  subDays,
} from "date-fns";
import prettier from "prettier";

import { PaymentStatus, PayoutStatus } from "@/utils";

import {
  type BuukiaAccount,
  type BuukiaAppointment,
  type BuukiaAssistant,
  type BuukiaClient,
  type MockData,
  type BuukiaService,
  type BuukiaCategory,
  type BuukiaPayment,
  type BuukiaPayout,
  CVCCheckStatus,
  PaymentNetworkStatus,
  PaymentRiskLevel,
  PaymentOutcomeType,
} from "../src/types";

const serviceNames = [
  "Basic Haircut",
  "Professional Manicure",
  "Relaxing Pedicure",
  "Deep Tissue Massage",
  "Rejuvenating Facial",
  "Yoga Session",
];

export const createCategory = (): BuukiaCategory => {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
  };
};

const serviceCategories: BuukiaCategory[] = [
  "Beauty",
  "Wellness",
  "Health",
  "Fitness",
  "Facials",
  "Massage",
  "Haircare",
  "Nailcare",
].map((name) => ({
  ...createCategory(),
  name,
}));

export const createService = (): BuukiaService => {
  return {
    id: faker.string.uuid(),
    description: faker.lorem.sentence(),
    category:
      serviceCategories[
        faker.number.int({ min: 0, max: serviceCategories.length - 1 })
      ],
    duration: faker.number.int({ min: 15, max: 30, multipleOf: 15 }).toString(),
    name: serviceNames[
      faker.number.int({ min: 0, max: serviceNames.length - 1 })
    ],
    price: faker.number.int({ min: 20 * 100, max: 200 * 100 }),
  };
};

const services: BuukiaService[] = Array.from({
  length: serviceNames.length,
}).map(() => createService());

export const createAssistant = (): BuukiaAssistant => {
  const [firstName, lastName] = [
    faker.person.firstName(),
    faker.person.lastName(),
  ];

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    name: `${firstName} ${lastName}`,
    initials: firstName[0] + lastName[0],
    categories: [
      ...new Map(
        Array.from({
          length: faker.number.int({ min: 1, max: 3 }),
        })
          .map(
            () =>
              serviceCategories[
                faker.number.int({ min: 0, max: serviceCategories.length - 1 })
              ],
          )
          .map((item) => [item["id"], item]),
      ).values(),
    ],
    availability: Array.from({ length: 7 }).map((_value, index) => ({
      dayOfWeek: index,
      times: [
        {
          start: "09:00",
          end: "17:00",
        },
      ],
    })),
    holidays: "",
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
  };
};

export const createAppointment = (): BuukiaAppointment => {
  const servicesMap = [
    ...new Map(
      Array.from({ length: faker.number.int({ min: 1, max: 2 }) }).map(() => {
        const service: BuukiaService =
          services[faker.number.int({ min: 0, max: services.length - 1 })];
        return [service.id, service];
      }),
    ).values(),
  ];

  return {
    id: faker.string.uuid(),
    assistant: createAssistant(),
    time: roundToNearestMinutes(
      faker.date.between({
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
      { nearestTo: 15 },
    ).toISOString(),
    stats: {
      services: {
        price: [...servicesMap].reduce(
          (sum, service) => sum + service.price,
          0,
        ),
        duration: [...servicesMap].reduce(
          (sum, service) => sum + parseInt(service.duration),
          0,
        ),
      },
    },
    client: createClient(),
    services: [...servicesMap],
    payments: [],
  };
};

export const createPayment = (): BuukiaPayment => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const status = faker.helpers.arrayElement([
    PaymentStatus.Disputed,
    PaymentStatus.Failed,
    PaymentStatus.Pending,
    PaymentStatus.Succeeded,
  ]);
  return {
    id: faker.string.uuid(),
    amount,
    currency: "EUR",
    createdAt: roundToNearestMinutes(
      faker.date.between({
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
      { nearestTo: 15 },
    ).toISOString(),
    refunded: faker.datatype.boolean(),
    disputed: faker.datatype.boolean(),
    paid: faker.datatype.boolean(),
    captured: true,
    outcome: {
      networkStatus:
        status === PaymentStatus.Succeeded
          ? PaymentNetworkStatus.ApprovedByNetwork
          : PaymentNetworkStatus.DeclinedByNetwork,
      reason: null,
      riskLevel: faker.helpers.arrayElement([
        PaymentRiskLevel.Elevated,
        PaymentRiskLevel.Highest,
        PaymentRiskLevel.Normal,
      ]),
      sellerMessage: faker.lorem.sentence(),
      type: faker.helpers.arrayElement([
        PaymentOutcomeType.Authorized,
        PaymentOutcomeType.ManualReview,
        PaymentOutcomeType.IssuerDeclined,
        PaymentOutcomeType.Blocked,
      ]),
    },
    description: faker.lorem.sentence(),
    paymentMethod: {
      amountAuthorized: amount,
      brand: faker.helpers.arrayElement([
        "visa",
        "mastercard",
        "amex",
        "discover",
      ]),
      expMonth: faker.number.int({ min: 1, max: 12 }),
      expYear: faker.number.int({ min: new Date().getFullYear(), max: 2030 }),
      last4: faker.finance.creditCardNumber().slice(-4),
      country: faker.location.countryCode(),
      fingerprint: faker.string.alphanumeric(16),
      funding: faker.helpers.arrayElement(["credit", "debit", "prepaid"]),
      checks: {
        addressLine1Check: faker.helpers.arrayElement([
          CVCCheckStatus.Pass,
          CVCCheckStatus.Fail,
          CVCCheckStatus.Unavailable,
          CVCCheckStatus.Unchecked,
        ]),
        addressPostalCodeCheck: faker.helpers.arrayElement([
          CVCCheckStatus.Pass,
          CVCCheckStatus.Fail,
          CVCCheckStatus.Unavailable,
          CVCCheckStatus.Unchecked,
        ]),
        cvcCheck: faker.helpers.arrayElement([
          CVCCheckStatus.Pass,
          CVCCheckStatus.Fail,
          CVCCheckStatus.Unavailable,
          CVCCheckStatus.Unchecked,
        ]),
      },
    },
    billing: {
      address: {
        city: faker.location.city(),
        country: faker.location.countryCode(),
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        postalCode: faker.location.zipCode(),
        state: faker.location.state(),
      },
      email: faker.internet.email(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      phone: faker.phone.number(),
      taxId: faker.string.alphanumeric(10),
    },
    provider: "stripe",
    sourceId: `ch_${faker.string.alphanumeric(24)}`,
    status,
  };
};

export const createPayout = (): BuukiaPayout => {
  const amount = faker.number.int({ min: 20 * 100, max: 200 * 100 });
  const payoutFee = Math.round(amount * 0.01);
  return {
    id: faker.string.uuid(),
    amount,
    currency: "EUR",
    createdAt: roundToNearestMinutes(
      faker.date.between({
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
      { nearestTo: 15 },
    ).toISOString(),
    arrivalDate: roundToNearestMinutes(
      faker.date.between({
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
      { nearestTo: 15 },
    ).toISOString(),
    description: faker.lorem.sentence(),
    statement_description: "BUUKIA",
    type: faker.helpers.arrayElement(["bank_account", "card"]),
    provider: "stripe",
    sourceId: `po_${faker.string.alphanumeric(24)}`,
    destination: `ba_${faker.string.alphanumeric(24)}`,
    fee: {
      rate: 0.01,
      amount: payoutFee,
    },
    status: faker.helpers.arrayElement([
      PayoutStatus.Paid,
      PayoutStatus.Pending,
      PayoutStatus.Failed,
      PayoutStatus.Canceled,
    ]),
  };
};

export const createAccount = (): BuukiaAccount => {
  return {
    id: faker.string.uuid(),
    personal: {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email(),
      dob: faker.date
        .birthdate({ min: 18, max: 65, mode: "age" })
        .toISOString(),
      tel: `+34 232323232`,
      thumbnail: faker.image.avatar(),
    },
    business: {
      name: faker.company.name(),
      tax: {
        number: faker.string.alphanumeric(10),
      },
      mobile: `+34 232323232`,
      contact: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        municipality: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.countryCode(),
      },
    },
  };
};

const [assistants, clients, categories, payments, payouts, accounts]: [
  BuukiaAssistant[],
  BuukiaClient[],
  BuukiaCategory[],
  BuukiaPayment[],
  BuukiaPayout[],
  BuukiaAccount[],
] = [
  Array.from({ length: 7 }).map(() => createAssistant()),
  Array.from({ length: 20 }).map(() => createClient()),
  serviceCategories,
  Array.from({ length: 10 }).map(() => createPayment()),
  Array.from({ length: 5 }).map(() => createPayout()),
  Array.from({ length: 5 }).map(() => createAccount()),
];

const dayStartDate = addMinutes(addHours(startOfDay(new Date()), 8), 0);
const dayEndDate = addMinutes(addHours(startOfDay(new Date()), 21), 0);

const weekStartDate = subDays(dayStartDate, 7);
const weekEndDate = addDays(dayStartDate, 7);

const hoursDiff = differenceInHours(dayEndDate, dayStartDate);
const daysDiff = differenceInDays(weekEndDate, weekStartDate);

const [appointments, todaysAppointments]: [
  BuukiaAppointment[],
  BuukiaAppointment[],
] = [
  Array.from({ length: 10 }).map(() => ({
    ...createAppointment(),
    assistant:
      assistants[faker.number.int({ min: 0, max: assistants.length - 1 })],
    client: clients[faker.number.int({ min: 0, max: clients.length - 1 })],
  })),
  Array.from({ length: daysDiff })
    .map((_, indexDay) =>
      Array.from({ length: hoursDiff }).map((_, index) => {
        return {
          ...createAppointment(),
          assistant:
            assistants[
              faker.number.int({ min: 0, max: assistants.length - 1 })
            ],
          client:
            clients[faker.number.int({ min: 0, max: clients.length - 1 })],
          time: roundToNearestMinutes(
            addHours(addDays(weekStartDate, indexDay), index),
            {
              nearestTo: 15,
            },
          ).toISOString(),
        };
      }),
    )
    .flat(),
];

const main = async (): Promise<void> => {
  const data: MockData = {
    accounts,
    appointments: [...appointments, ...todaysAppointments],
    assistants,
    categories,
    clients,
    payments,
    payouts,
    services,
  };

  const formattedCode = await prettier.format(JSON.stringify(data), {
    parser: "json",
  });

  fs.writeFileSync(path.resolve("src/routes/data.json"), formattedCode);
  console.log("✅ Mock data generated successfully!");
};

main();
