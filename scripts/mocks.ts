import * as fs from "node:fs";
import path from "node:path";

import { faker } from "@faker-js/faker";
import prettier from "prettier";

const serviceNames = ["Haircut", "Manicure", "Pedicure", "Massage"];

const businessNames = [
  "Elegance Salon",
  "Urban Spa",
  "Glamour Studio",
  "Relaxation Haven",
];

const serviceCategories = ["Beauty", "Wellness", "Health", "Fitness"];

const assistants = Array.from(Array(10).keys()).map(() => {
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
      regular: [],
      exceptions: [],
      holidays: [],
    },
    business:
      businessNames[faker.number.int({ min: 0, max: businessNames.length })],
    type: serviceCategories[
      faker.number.int({ min: 0, max: serviceCategories.length })
    ],
  };
});

const services = Array.from(Array(serviceNames.length).keys()).map((_) => ({
  id: faker.string.uuid(),
  description: faker.lorem.sentence(),
  business:
    businessNames[faker.number.int({ min: 0, max: businessNames.length })],
  category:
    serviceCategories[
      faker.number.int({ min: 0, max: serviceCategories.length })
    ],
  duration: faker.number.int({ min: 30, max: 120 }),
  name: serviceNames[faker.number.int({ min: 0, max: serviceNames.length })],
  price: faker.number.int({ min: 20, max: 200 }),
}));

const main = async () => {
  const formattedCode = await prettier.format(
    JSON.stringify({
      assistants,
      services,
    }),
    { parser: "json" }
  );

  await fs.writeFileSync(path.resolve("src/routes/data.json"), formattedCode);
};

main();
