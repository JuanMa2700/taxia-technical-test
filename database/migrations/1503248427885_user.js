"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("username", 30).notNullable().unique();
      table.string("email", 50).notNullable().unique();
      table.string("password", 60).notNullable();
      table.string("roles", 30).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.dropIfExists("users");
  }
}

module.exports = UserSchema;
