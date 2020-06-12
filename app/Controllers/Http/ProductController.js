"use strict";

const productService = use("App/Services/ProductService");
const Store = use("App/Models/Store");
const Product = use("App/Models/Product");

class ProductController {
  /**
   * @param page The page for paginated query.
   * @return The page with products having stock bigger than 0.
   */
  async availableProducts({ request, response }) {
    return response.ok(await productService.availableProducts(request));
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The user id associated to the Store to extract the products.
   * @return The page with products offered by the user store.
   */
  async sellerProducts({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await productService.sellerProducts(request));
  }
  /**
   * @body to create product
   * name: string,
   * price: number,
   * stock: number
   * @return The created product data.
   */
  async registerProduct({ auth, request, response }) {
    return response.created(
      await productService.registerProduct(auth, request)
    );
  }
  /**
   * @param product_id The product id to consult.
   * @return The entire product data.
   */
  async productDetails({ request, response }) {
    return response.ok(await productService.productDetails(request));
  }
  /**
   * @param product_id[optional] The product id to consult.
   * @return The count of purchases associated to the product id given if exists
   * else the count of purchases associated to products offered by the authenticated seller
   */
  async salesCount({ auth, request, response }) {
    if (!request.get().product_id) {
      return response.ok(await productService.totalSalesCount(auth));
    }
    await this.productAccessPermission(auth, request);
    return response.ok(await productService.productSalesCount(request));
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
   * Allow user to access only their own products based on product_id param in url
   * if role is admin, access is granted
   * if role is seller, access is granted for their offered products only
   * */
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
