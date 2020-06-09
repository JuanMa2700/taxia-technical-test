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
    const userData = request.only(["username", "email", "password"]);
    userData.roles = "customer";
    const user = await User.create(userData);
    return response.created(user.toJSON());
  }

  async createSeller({ request, response }) {
    const userData = request.only(["username", "email", "password"]);
    userData.roles = "seller";
    const user = await User.create(userData);
    return response.created(user.toJSON());
  }
}

module.exports = UserController;
