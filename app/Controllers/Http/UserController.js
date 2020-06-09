"use strict";

const User = use("App/Models/User");
const Purchase = use("App/Models/Purchase");
const Store = use("App/Models/Store");

class UserController {
  async login({ auth, request, response }) {
    const { email, password } = request.all();
    return response.ok(await auth.attempt(email, password));
  }

  async index({ request, response }) {
    const page = request.get().page || 1;
    return response.ok((await User.query().paginate(page, 10)).toJSON());
  }

  async createCustomer({ request, response }) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "customer";
    const created = await User.create(user);
    return response.created(created.toJSON());
  }

  async createSeller({ request, response }) {
    const user = request.only(["username", "email", "password"]);
    user.roles = "seller";
    const created = await User.create(user);
    return response.created(created.toJSON());
  }
  async potentialCustomers({ auth, request, response }) {
    const page = request.get().page || 1;
    const { initialDate, finalDate } = request.all();
    const store = await Store.findBy("user_id", auth.user.id);
    return response.ok(
      await store
        .purchases()
        .whereBetween("transaction_date", [initialDate, finalDate])
        .paginate(page, 10)
    );
  }
}

module.exports = UserController;
