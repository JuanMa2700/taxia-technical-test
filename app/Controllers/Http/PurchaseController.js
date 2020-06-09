"use strict";

const Purchase = use("App/Models/Purchase");
const Store = use("App/Models/Store");

class PurchaseController {
  async makePurchase({ auth, request, response }) {
    const purchase = request.only(["product_id"]);
    purchase.user_id = auth.user.id;
    return response.created(await Purchase.create(purchase));
  }
  async purchaseDetails({ request, response }) {
    const purchase = await Purchase.query()
      .with("user")
      .with("product")
      .where("id", request.get().purchase_id)
      .fetch();
    return response.ok(purchase);
  }
  async customerPurchases({ auth, request, response }) {
    this.hasPermission(auth, request);
    const page = request.get().page || 1;
    return response.ok(
      await Purchase.query()
        .with("product")
        .where("user_id", request.get().user_id)
        .paginate(page, 10)
    );
  }
  async sellerSales({ auth, request, response }) {
    this.hasPermission(auth, request);
    const page = request.get().page || 1;
    const store = await Store.findBy("user_id", request.get().user_id);
    return response.ok(
      await store.purchases().with("user").with("product").paginate(page, 10)
    );
  }
  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().user_id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
}

module.exports = PurchaseController;
