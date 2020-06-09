"use strict";

const Product = use("App/Models/Product");
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
    this.hasPermission(auth, request);
    const page = request.get().page || 1;
    const user = await User.find(request.get().id);
    const store = await user.store().fetch();
    return response.ok(await store.products().paginate(page, 10));
  }

  async registerProduct({ auth, request, response }) {
    const product = request.only(["name", "price", "stock"]);
    const store = await Store.findBy("user_id", auth.user.id);
    product.store_id = store.id;
    return response.created(await Product.create(product));
  }

  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
}

module.exports = ProductController;
