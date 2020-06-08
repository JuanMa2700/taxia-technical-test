"use strict";

const User = use("App/Models/User");

class UserController {
  async login({ auth, request, response }) {
    const { email, password } = request.all();
    return response.ok().json(await auth.attempt(email, password));
  }

  async index({ request, response }) {
    const page = request.get().page || 1;
    return response.ok().json(await User.query().paginate(page, 10));
  }

  async createCustomer({ request, response }) {
    const userData = request.only(["username", "email", "password"]);
    userData.roles = "customer";
    try {
      const user = await User.create(userData);
      return response.creatd().json(user);
    } catch (e) {
      return response
        .internalServerError()
        .json({ error: e.sqlMessage || e.code });
    }
  }

  async createSeller({ request, response }) {
    const userData = request.only(["username", "email", "password"]);
    userData.roles = "seller";
    try {
      const user = await User.create(userData);
      return response.created().json(user);
    } catch (e) {
      return response
        .internalServerError()
        .json({ error: e.sqlMessage || e.code });
    }
  }
}

module.exports = UserController;
