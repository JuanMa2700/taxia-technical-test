"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }
  store() {
    return this.belongsTo("App/Models/Store");
  }
  purchases() {
    return this.hasMany("App/Models/Purchase");
  }
}

module.exports = Product;
