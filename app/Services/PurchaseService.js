"use strict";

const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const Store = use("App/Models/Store");
const MongoStore = use("App/MongoShemas/StoreSchema");
const unirest = use("unirest");

class PurchaseService {
  async makePurchase(auth, request) {
    const { latitude, longitude, product_id } = request.all();
    if (!latitude || !longitude || !product_id) throw { code: "MISSING_DATA" };
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
  async purchaseDetails(request) {
    return await Purchase.query()
      .with("user")
      .with("product")
      .where("id", request.get().purchase_id)
      .fetch();
  }
  async customerPurchases(request) {
    const page = request.get().page || 1;
    return await Purchase.query()
      .with("product")
      .where("user_id", request.get().user_id)
      .paginate(page, 10);
  }
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
