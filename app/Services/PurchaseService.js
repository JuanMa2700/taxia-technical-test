"use strict";

const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const Store = use("App/Models/Store");
const MongoStore = use("App/MongoSchemas/StoreSchema");
const unirest = use("unirest");

class PurchaseService {
  /**
   * @body to create a purchase validating coordinates with store coverage
   * product_id: number,
   * latitude: number,
   * longitude: number
   * @return The created purchase data.
   */
  async makePurchase(auth, request) {
    const { latitude, longitude, product_id } = request.all();
    const product = await Product.find(product_id);
    const store = await product.store().fetch();
    const possible = await MongoStore.findOne({
      store_id: store.id,
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
          },
        },
      },
    });
    if (!possible) throw { code: "NOT_COVERED" };
    const purchase = request.only(["product_id"]);
    purchase.user_id = auth.user.id;
    const res = await unirest
      .get("https://trueway-geocoding.p.rapidapi.com/ReverseGeocode")
      .headers({
        "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
        "x-rapidapi-key": "38bab58a28msh6984e73bc9ccf7ep1c13f7jsnbbeee56ca525",
        useQueryString: true,
      })
      .query({
        language: "en",
        location: longitude + "%2C " + latitude,
      });
    purchase.address = res.body.results[0].address;
    return await Purchase.create(purchase);
  }
  /**
   * @param purchase_id The purchase id to consult.
   * @return The entire purchase data.
   */
  async purchaseDetails(request) {
    return await Purchase.query()
      .with("user")
      .with("product")
      .where("id", request.get().purchase_id)
      .fetch();
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The customer user id associated to the purchases.
   * @return The page with purchases made by the customer.
   */
  async customerPurchases(request) {
    const page = request.get().page || 1;
    return await Purchase.query()
      .with("product")
      .where("user_id", request.get().user_id)
      .paginate(page, 10);
  }
  /**
   * @param page The page for paginated query.
   * @param user_id The seller user id associated to the store to extract purchases.
   * @return The page with purchases made in this store.
   */
  async sellerSales(request) {
    const page = request.get().page || 1;
    const store = await Store.findBy("user_id", request.get().user_id);
    return await store
      .purchases()
      .with("user")
      .with("product")
      .paginate(page, 10);
  }
}

module.exports = new PurchaseService();
