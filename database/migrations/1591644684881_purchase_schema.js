"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PurchaseSchema extends Schema {
  up() {
    this.create("purchases", (table) => {
      table.increments();
      table.timestamps();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products");
      table.integer("value").notNullable();
      table.date("transaction_date");
    });
  }

  down() {
    this.drop("purchases");
  }
}

module.exports = PurchaseSchema;
