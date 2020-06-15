"use strict";

const Product = use("App/Models/Product");
const Purchase = use("App/Models/Purchase");
const User = use("App/Models/User");
const Store = use("App/Models/Store");

class ProductService {
  /**
   * @param page The page for paginated query.
   * @return The page with products having stock bigger than 0.
   */
  async availableProducts(request) {
    const page = request.get().page || 1;
    return await Product.query().where("stock", ">", 0).paginate(page, 10);
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The user id associated to the Store to extract the products.
   * @return The page with products offered by the user store.
   */
  async sellerProducts(request) {
    const page = request.get().page || 1;
    const user = await User.find(request.get().user_id);
    return await user.products().paginate(page, 10);
  }
  /**
   * @param product_id The product id to consult.
   * @return The entire product data.
   */
  async productDetails(request) {
    return await Product.find(request.get().product_id);
  }
  /**
   * @body to create product
   * name: string,
   * description: string,
   * price: number,
   * stock: number
   * @return The created product data.
   */
  async registerProduct(auth, request, response) {
    const product = request.only([
      "name",
      "price",
      "stock",
      "image_url",
      "description",
    ]);
    const store = await Store.findBy("user_id", auth.user.id);
    product.store_id = store.id;
    return await Product.create(product);
  }
  /**
   * @return The count of purchases associated to products
   * offered by the authenticated seller
   */
  async totalSalesCount(auth) {
    const store = await Store.findBy("user_id", auth.user.id);
    const ids = await Product.query().where("store_id", store.id).ids();
    const total = await Purchase.query().count().whereIn("product_id", ids);
    return { total: total[0]["count(*)"] };
  }
  /**
   * @param product_id The product id to consult.
   * @return The count of purchases associated to the product id given
   */
  async productSalesCount(request) {
    const total = await Purchase.query()
      .count()
      .where("product_id", request.get().product_id);
    return { total: total[0]["count(*)"] };
  }
}

module.exports = new ProductService();
