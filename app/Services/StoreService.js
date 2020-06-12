"use strict";

const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const Store = use("App/Models/Store");
const MongoStore = use("App/MongoSchemas/StoreSchema");
const unirest = use("unirest");

class StoreService {
  /**
   * @param user_id The user id associated to the Store.
   * @return The Store associated with the given user id
   */
  async storeDetails(request) {
    return await Store.findBy("user_id", request.get().user_id);
  }
}

module.exports = new StoreService();
