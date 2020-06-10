"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Purchase extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", async (purchaseInstance) => {
      if (!purchaseInstance.transaction_date)
        purchaseInstance.transaction_date = new Date();
    });
    this.addHook("afterSave", async (purchaseInstance) => {
      const product = await purchaseInstance.product().fetch();
      product.stock = product.stock - 1;
      if (product.stock < 0) {
        purchaseInstance.delete();
        throw { code: "NO_PRODUCT" };
      }
      product.save();
    });
  }
  static get hidden() {
    return ["created_at", "updated_at"];
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
  product() {
    return this.belongsTo("App/Models/Product");
  }
}

module.exports = Purchase;
