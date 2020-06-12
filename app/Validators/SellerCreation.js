"use strict";

class SellerCreation {
  get rules() {
    return {
      username: "required|string",
      email: "required|email",
      password: "required|string",
      storeName: "required|string",
      storeCity: "required|string",
      storeAddress: "required|string",
    };
  }
  get messages() {
    return {
      "username.string": "The username must be a string",
      "username.required": "You must provide a username",
      "email.string": "The email must be a valid email",
      "email.required": "You must provide a email",
      "password.string": "The password must be a string",
      "password.required": "You must provide a password",
      "storeName.string": "The store name must be a string",
      "storeName.required": "You must provide a store name",
      "storeCity.string": "The store city must be a string",
      "storeCity.required": "You must provide a store city",
      "storeAddress.string": "The store address must be a string",
      "storeAddress.required": "You must provide a store address",
    };
  }
}

module.exports = SellerCreation;
