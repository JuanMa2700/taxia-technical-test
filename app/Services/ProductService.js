"use strict";

const Product = use("App/Models/Product");
const Purchase = use("App/Models/Purchase");
const User = use("App/Models/User");
const Store = use("App/Models/Store");

class ProductService {
  async availableProducts(request) {
    const page = request.get().page || 1;
    return await Product.query().where("stock", ">", 0).paginate(page, 10);
  }
  async sellerProducts(request) {
    const page = request.get().page || 1;
    const user = await User.find(request.get().user_id);
    return await user.products().paginate(page, 10);
  }

  async registerProduct(auth, request, response) {
    const product = request.only(["name", "price", "stock", "image_url"]);
    const store = await Store.findBy("user_id", auth.user.id);
    product.store_id = store.id;
    return await Product.create(product);
  }
  async totalSalesCount(auth) {
    const store = await Store.findBy("user_id", auth.user.id);
    const ids = await Product.query().where("store_id", store.id).ids();
    const total = await Purchase.query().count().whereIn("product_id", ids);
    return { total: total[0]["count(*)"] };
  }
  async productSalesCount(request) {
    const total = await Purchase.query()
      .count()
      .where("product_id", request.get().product_id);
    return { total: total[0]["count(*)"] };
  }
}

module.exports = new ProductService();
