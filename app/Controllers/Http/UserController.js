"use strict";

const userService = use("App/Services/UserService");

class UserController {
  async login({ auth, request, response }) {
    return response.ok(await userService.login(auth, request));
  }
  async index({ request, response }) {
    return response.ok(await userService.index(request));
  }
  async createCustomer({ request, response }) {
    return response.created(await userService.createCustomer(request));
  }
  async createSeller({ request, response }) {
    return response.created(await userService.createSeller(request));
  }
  async potentialCustomers({ auth, request, response }) {
    return response.ok(await userService.potentialCustomers(auth, request));
  }
}

module.exports = UserController;
