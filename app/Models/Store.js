"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Store extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
  products() {
    return this.hasMany("App/Models/Product");
  }
  purchases() {
    return this.manyThrough("App/Models/Product", "purchases");
  }
}

module.exports = Store;
