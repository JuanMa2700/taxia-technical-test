"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Authorized {
  async handle({ auth, response }, next, properties) {
    if (auth.user.roles.split(",").some((x) => properties.includes(x))) {
      await next();
    } else {
      throw { code: "UNAUTHORIZED" };
    }
  }
}

module.exports = Authorized;
