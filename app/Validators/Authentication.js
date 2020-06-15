"use strict";

class CustomerCreation {
  get rules() {
    return {
      email: "required|email",
      password: "required|string",
    };
  }
  get messages() {
    return {
      "email.string": "The email must be a valid email",
      "email.required": "You must provide an email",
      "password.string": "The password must be a string",
      "password.required": "You must provide a password",
    };
  }
}

module.exports = CustomerCreation;
