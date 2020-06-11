"use strict";

const User = use("App/Models/User");
const Store = use("App/Models/Store");
const dayjs = use("dayjs");

class UserService {
  async login(auth, request) {
    const { email, password } = request.all();
    return await auth.attempt(email, password);
  }

  async index(request) {
    const page = request.get().page || 1;
    return await User.query().paginate(page, 10);
  }

  async createCustomer(request) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "customer";
    const created = await User.create(user);
    return created;
  }

  async createSeller(request) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "seller";
    const created = await User.create(user);
    return created;
  }
  async potentialCustomers(auth, request) {
    const page = request.get().page || 1;
    let { initialDate, finalDate } = request.all();
    const store = await Store.findBy("user_id", auth.user.id);
    if (!initialDate || !finalDate)
      return await store.purchases().with("user").paginate(page, 10);
    if (!dayjs(initialDate).isValid() || !dayjs(initialDate).isValid())
      throw { code: "INVALID_DATE" };
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
