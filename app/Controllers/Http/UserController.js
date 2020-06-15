"use strict";

const userService = use("App/Services/UserService");

class UserController {
  /**
   * @body to authenticate user
   * email: string,
   * password: string,
   * @return The jwt token for requests headers.
   */
  async login({ auth, request, response }) {
    return response.ok(await userService.login(auth, request));
  }
  /**
   * @return Authenticated user information.
   */
  async authenticatedUserInfo({ auth, response }) {
    return response.ok(await userService.authenticatedUserInfo(auth));
  }
  /**
   * @param page The page for paginated query.
   * @return The page with users registered in system.
   */
  async index({ request, response }) {
    return response.ok(await userService.index(request));
  }
  /**
   * @body to create customer
   * username: string
   * email: string
   * password: string
   * @return The created customer data.
   */
  async createCustomer({ request, response }) {
    return response.created(await userService.createCustomer(request));
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
  async createSeller({ request, response }) {
    return response.created(await userService.createSeller(request));
  }
  /**
   * @param page The page for paginated query.
   * @body to query purchases between dates
   * initialDate: date
   * finalDate: date
   * @return the purchases with their customers between the
   * given dates associated to products offered by the authenticated seller
   */
  async potentialCustomers({ auth, request, response }) {
    return response.ok(await userService.potentialCustomers(auth, request));
  }
}

module.exports = UserController;
