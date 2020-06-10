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
      password: "1234",
      roles: "admin,customer,seller",
    });
    const seller = await User.create({
      id: 2,
      username: "seller",
      email: "seller@gmail.com",
      password: "1234",
      roles: "seller",
    });
    const sellerStore = await Factory.model("App/Models/Store").make();
    await seller.store().save(sellerStore);
    for (let j = 0; j < 10; j++) {
      const product = await Factory.model("App/Models/Product").make();
      await sellerStore.products().save(product);
    }
    const customer = await User.create({
      id: 3,
      username: "customer",
      email: "customer@gmail.com",
      password: "1234",
      roles: "customer",
    });
    for (let i = 0; i < 10; i++) {
      const user = await Factory.model("App/Models/User").create();
      const store = await Factory.model("App/Models/Store").make();
      await user.store().save(store);
      const random = Math.random() * (6 - 3) + 3;
      for (let j = 0; j < random; j++) {
        const product = await Factory.model("App/Models/Product").make();
        await store.products().save(product);
      }
    }
    for (let j = 0; j < 30; j++) {
      const product = await Product.find(
        Math.floor(Math.random() * (40 - 1) + 1)
      );
      const day = Math.floor(Math.random() * (28 - 1) + 1);
      const month = Math.floor(Math.random() * (12 - 1) + 1);
      const date = "2020/" + month + "/" + day;
      const purchase = {
        user_id: customer.id,
        product_id: product.id,
        transaction_date: date,
      };
      try {
        await Purchase.create(purchase);
        product.stock = product.stock + 1;
        await product.save();
      } catch (error) {}
    }
    for (let i = 0; i < 8; i++) {
      const user = await Factory.model("App/Models/User").make();
      user.roles = "customer";
      await user.save();
      const random = Math.random() * (20 - 10) + 10;
      for (let j = 0; j < random; j++) {
        const product = await Product.find(
          Math.floor(Math.random() * (40 - 1) + 1)
        );
        const day = Math.floor(Math.random() * (28 - 1) + 1);
        const month = Math.floor(Math.random() * (12 - 1) + 1);
        const date = "2020/" + month + "/" + day;
        const purchase = {
          user_id: user.id,
          product_id: product.id,
          transaction_date: date,
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
