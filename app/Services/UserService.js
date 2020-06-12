"use strict";

const User = use("App/Models/User");
const Store = use("App/Models/Store");
const MongoStore = use("App/MongoSchemas/StoreSchema");
const MongoCity = use("App/MongoSchemas/CitySchema");
const dayjs = use("dayjs");

class UserService {
  /**
   * @body to authenticate user
   * email: string,
   * password: string,
   * @return The jwt token for requests headers.
   */
  async login(auth, request) {
    const { email, password } = request.all();
    return await auth.attempt(email, password);
  }
  /**
   * @param page The page for paginated query.
   * @return The page with users registered in system.
   */
  async index(request) {
    const page = request.get().page || 1;
    return await User.query().paginate(page, 10);
  }
  /**
   * @body to create customer
   * username: string
   * email: string
   * password: string
   * @return The created customer data.
   */
  async createCustomer(request) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "customer";
    const created = await User.create(user);
    return created;
  }
  /**
   * @body to create seller and their associated store
   * username: string
   * email: string
   * password: string
   * storeName: string
   * storeAddress: string
   * storeCity: string
   * @return The created customer data.
   */
  async createSeller(request) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "seller";
    const { storeName, storeAddress, storeCity } = request.all();
    const newUser = await User.create(user);
    const store = await Store.create({
      name: storeName,
      address: storeAddress,
      city: storeCity,
    });
    newUser.store().save(store);
    const city = await MongoCity.findOne({ name: storeCity });
    await MongoStore.create({ store_id: store.id, location: city.location });
    return newUser;
  }
  /**
   * @param page The page for paginated query.
   * @body to query purchases between dates
   * initialDate: date
   * finalDate: date
   * @return the purchases with their customers between the
   * given dates associated to products offered by the authenticated seller
   */
  async potentialCustomers(auth, request) {
    const page = request.get().page || 1;
    let { initialDate, finalDate } = request.all();
    const store = await Store.findBy("user_id", auth.user.id);
    initialDate = dayjs(initialDate).format("YYYY-MM-DD");
    finalDate = dayjs(finalDate).format("YYYY-MM-DD");
    return await store
      .purchases()
      .with("user")
      .whereBetween("transaction_date", [initialDate, finalDate])
      .paginate(page, 10);
  }
}

module.exports = new UserService();
