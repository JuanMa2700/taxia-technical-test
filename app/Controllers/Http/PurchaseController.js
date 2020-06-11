"use strict";

const purchaseService = use("App/Services/PurchaseService");
const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const Store = use("App/Models/Store");

class PurchaseController {
  async makePurchase({ auth, request, response }) {
    return response.created(await purchaseService.makePurchase(auth, request));
  }
  async purchaseDetails({ auth, request, response }) {
    await this.purchaseAccessPermission(auth, request);
    return response.ok(await purchaseService.purchaseDetails(request));
  }
  async customerPurchases({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await purchaseService.customerPurchases(request));
  }
  async sellerSales({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await purchaseService.sellerSales(request));
  }
  // Allow user to access only their own resources based on user_id param in url
  // if role is admin, access is granted
  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().user_id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
  // Allow user to access only their own purchases based on purchase_id param in url
  // if role is admin, access is granted
  // if role is customer, access is granted for their purchases only
  // if role is seller, access is granted for their sales only
  async purchaseAccessPermission(auth, request) {
    if (!auth.user.roles.includes("admin")) {
      if (auth.user.roles.includes("customer")) {
        const ids = await Purchase.query().where("user_id", auth.user.id).ids();
        if (!ids.includes(parseInt(request.get().purchase_id))) {
          throw { code: "UNAUTHORIZED" };
        }
      } else if (auth.user.roles.includes("seller")) {
        const store = await Store.findBy("user_id", auth.user.id);
        const purchases = await store.purchases().fetch();
        const permission = purchases.rows.some(
          (p) => p.id == parseInt(request.get().purchase_id)
        );
        if (!permission) throw { code: "UNAUTHORIZED" };
      }
    }
  }
}

module.exports = PurchaseController;
