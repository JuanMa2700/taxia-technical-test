"use strict";

const User = use("App/Models/User");

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
}

module.exports = UserController;
