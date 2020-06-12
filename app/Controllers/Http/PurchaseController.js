"use strict";

const purchaseService = use("App/Services/PurchaseService");
const Purchase = use("App/Models/Purchase");
const Store = use("App/Models/Store");

class PurchaseController {
  /**
   * @body to create a purchase validating coordinates with store coverage
   * product_id: number,
   * latitude: number,
   * longitude: number
   * @return The created purchase data.
   */
  async makePurchase({ auth, request, response }) {
    return response.created(await purchaseService.makePurchase(auth, request));
  }
  /**
   * @param purchase_id The purchase id to consult.
   * @return The entire purchase data.
   */
  async purchaseDetails({ auth, request, response }) {
    await this.purchaseAccessPermission(auth, request);
    return response.ok(await purchaseService.purchaseDetails(request));
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The customer user id associated to the purchases.
   * @return The page with purchases made by the customer.
   */
  async customerPurchases({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await purchaseService.customerPurchases(request));
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The seller user id associated to the store to extract purchases.
   * @return The page with purchases made in this store.
   */
  async sellerSales({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await purchaseService.sellerSales(request));
  }
  /**
   * Allow user to access only their own store based on user_id param in url
   * if role is admin, access is granted
   */
  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().user_id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
  /**
   * Allow user to access only their own purchases based on purchase_id param in url
   * if role is admin, access is granted
   * if role is customer, access is granted for their purchases only
   * if role is seller, access is granted for their sales only
   */
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
