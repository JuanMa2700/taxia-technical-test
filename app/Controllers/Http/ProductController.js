"use strict";

const productService = use("App/Services/ProductService");
const Store = use("App/Models/Store");
const Product = use("App/Models/Product");

class ProductController {
  async availableProducts({ request, response }) {
    return response.ok(await productService.availableProducts(request));
  }
  async sellerProducts({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await productService.sellerProducts(request));
  }

  async registerProduct({ auth, request, response }) {
    return response.created(
      await productService.registerProduct(auth, request)
    );
  }
  async salesCount({ auth, request, response }) {
    if (!request.get().product_id) {
      return response.ok(await productService.totalSalesCount(auth));
    }
    await this.productAccessPermission(auth, request);
    return response.ok(await productService.productSalesCount(request));
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
  // Allow user to access only their own products based on product_id param in url
  // if role is admin, access is granted
  // if role is seller, access is granted for their offered products only
  async productAccessPermission(auth, request) {
    if (!auth.user.roles.includes("admin")) {
      const store = await Store.findBy("user_id", auth.user.id);
      const ids = await Product.query().where("store_id", store.id).ids();
      if (!ids.includes(parseInt(request.get().product_id))) {
        throw { code: "UNAUTHORIZED" };
      }
    }
  }
}

module.exports = ProductController;
