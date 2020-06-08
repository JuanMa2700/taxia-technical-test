"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  store() {
    return this.belongsTo("App/Models/Store");
  }
  purchases() {
    return this.hasMany("App/Models/Purchase");
  }
}

module.exports = Product;
