"use strict";

const storeService = use("App/Services/StoreService");

class StoreController {
  /**
   * @param user_id The user id associated to the Store.
   * @return The Store associated with the given user id
   */
  async storeDetails({ auth, request, response }) {
    this.hasPermission(auth, request);
    return response.ok(await storeService.storeDetails(request));
  }
  /**
   * Allow user to access only their own store based on user_id param in url
   * if role is admin, access is granted
   */
  hasPermission(auth, request) {
    if (
      auth.user.id != request.get().user_id &&
      !auth.user.roles.split(",").some((x) => x === "admin")
    )
      throw { code: "UNAUTHORIZED" };
  }
}

module.exports = StoreController;
