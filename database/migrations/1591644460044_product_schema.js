"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 50).notNullable().unique();
      table.integer("price").notNullable();
      table.integer("stock").notNullable();
      table.integer("store_id").unsigned().references("id").inTable("stores");
    });
  }

  down() {
    this.dropIfExists("products");
  }
}

module.exports = ProductSchema;
