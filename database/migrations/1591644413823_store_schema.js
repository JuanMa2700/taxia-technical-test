"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StoreSchema extends Schema {
  up() {
    this.create("stores", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 50).notNullable().unique();
      table.integer("address", 60);
      table.integer("user_id").unsigned().references("id").inTable("users");
    });
  }

  down() {
    this.dropIfExists("stores");
  }
}

module.exports = StoreSchema;
