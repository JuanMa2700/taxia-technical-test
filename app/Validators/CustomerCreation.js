"use strict";

class CustomerCreation {
  get rules() {
    return {
      username: "required|string",
      email: "required|email",
      password: "required|string",
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
    };
  }
}

module.exports = CustomerCreation;
