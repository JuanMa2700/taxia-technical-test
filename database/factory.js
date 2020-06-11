"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

Factory.blueprint("App/Models/User", (faker) => {
  return {
    username: faker.name(),
    email: faker.email({ domain: "gmail.com" }),
    password: "1234",
    roles: "seller",
  };
});

Factory.blueprint("App/Models/Store", (faker) => {
  return {
    name: faker.word({ syllables: Math.random() * (5 - 1) + 1 }),
    address: faker.address(),
  };
});

Factory.blueprint("App/Models/Product", (faker) => {
  return {
    name: faker.word({ syllables: Math.random() * (5 - 1) + 1 }),
    price: faker.integer({ min: 100, max: 5000 }),
    stock: faker.integer({ min: 1, max: 10 }),
    image_url: "https://picsum.photos/200/300",
  };
});
