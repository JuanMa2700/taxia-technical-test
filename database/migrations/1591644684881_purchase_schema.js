"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PurchaseSchema extends Schema {
  up() {
    this.create("purchases", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable();
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products")
        .notNullable();
      table.string("address", 100).notNullable();
      table.dateTime("transaction_date").notNullable();
    });
  }

  down() {
    this.drop("purchases");
  }
}

module.exports = PurchaseSchema;
