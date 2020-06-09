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
const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const User = use("App/Models/User");

class FakeRecordSeeder {
  async run() {
    // Populate settings records!
    await User.create({
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
      password:
        "$2a$10$AYq1GcjVseVpQqEYnn1souXkZmfIa6M4OZzr4FEt77hoEiIib0KTK" /*1234*/,
      roles: "admin,customer,seller",
    });
    for (let i = 0; i < 15; i++) {
      const user = await Factory.model("App/Models/User").create();
      const store = await Factory.model("App/Models/Store").make();
      await user.store().save(store);
      const random = Math.random() * (6 - 3) + 2;
      for (let j = 0; j < random; j++) {
        const product = await Factory.model("App/Models/Product").make();
        await store.products().save(product);
      }
    }
    for (let i = 0; i < 8; i++) {
      const user = await Factory.model("App/Models/User").make();
      user.roles = "customer";
      await user.save();
      const random = Math.random() * (20 - 10) + 10;
      for (let j = 0; j < random; j++) {
        const product = await Product.find(
          Math.floor(Math.random() * (45 - 1) + 1)
        );
        const purchase = {
          user_id: user.id,
          product_id: product.id,
        };
        try {
          await Purchase.create(purchase);
          product.stock = product.stock + 1;
          await product.save();
        } catch (error) {}
      }
    }
  }
}

module.exports = FakeRecordSeeder;
