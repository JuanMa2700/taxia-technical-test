"use strict";

const Product = use("App/Models/Product");
const Purchase = use("App/Models/Purchase");
const User = use("App/Models/User");
const Store = use("App/Models/Store");

class ProductController {
  async aviableProducts({ request, response }) {
    const page = request.get().page || 1;
    return response.ok(
      await Product.query().where("stock", ">", 0).paginate(page, 10)
    );
  }
  async sellerProducts({ auth, request, response }) {
    await this.hasPermission(auth, request);
    const page = request.get().page || 1;
    const user = await User.find(request.get().user_id);
    return response.ok(await user.products().paginate(page, 10));
  }

  async registerProduct({ auth, request, response }) {
    const product = request.only(["name", "price", "stock"]);
    const store = await Store.findBy("user_id", auth.user.id);
    product.store_id = store.id;
    return response.created(await Product.create(product));
  }
  async salesCount({ auth, request, response }) {
    if (!request.get().product_id) {
      const store = await Store.findBy("user_id", auth.user.id);
      const ids = await Product.query().where("store_id", store.id).ids();
      const total = await Purchase.query().count().whereIn("product_id", ids);
      return response.ok({ total: total[0]["count(*)"] });
    }
    await this.accessProductPermission(auth, request);
    const total = await Purchase.query()
      .count()
      .where("product_id", request.get().product_id);
    return response.ok({ total: total[0]["count(*)"] });
  }
  async accessProductPermission(auth, request) {
    if (!auth.user.roles.includes("admin")) {
      const store = await Store.findBy("user_id", auth.user.id);
      const ids = await Product.query().where("store_id", store.id).ids();
      if (!ids.includes(parseInt(request.get().product_id))) {
        throw { code: "UNAUTHORIZED" };
      }
    }
  }
  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().user_id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
}

module.exports = ProductController;
