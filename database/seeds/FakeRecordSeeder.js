"use strict";

/*
|--------------------------------------------------------------------------
| FakeRecordSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const db = use("Database");

class FakeRecordSeeder {
  async run() {
    // Populate settings records!
    await db.table("users").insert([
      {
        id: 1,
        username: "admin",
        email: "admin@gmail.com",
        password:
          "$2a$10$AYq1GcjVseVpQqEYnn1souXkZmfIa6M4OZzr4FEt77hoEiIib0KTK" /*1234*/,
        roles: "admin,customer,seller",
      },
    ]);
    for (let i = 0; i < 15; i++) {
      const user = await Factory.model("App/Models/User").create();
      const store = await Factory.model("App/Models/Store").make();
      await user.store().save(store);
      const random = Math.random() * (6 - 1) + 1;
      for (let j = 0; j < random; j++) {
        const product = await Factory.model("App/Models/Product").make();
        await store.products().save(product);
      }
    }
  }
}

module.exports = FakeRecordSeeder;
