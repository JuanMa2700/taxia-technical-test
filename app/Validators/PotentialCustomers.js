"use strict";

class PotentialCustomers {
  get rules() {
    return {
      initialDate: "required|date",
      finalDate: "required|date",
    };
  }
  get messages() {
    return {
      "initialDate.date": "The initial date must be a valid date",
      "initialDate.required": "You must provide an initial date",
      "finalDate.date": "The final date must be a valid date",
      "finalDate.required": "You must provide a final date",
    };
  }
}

module.exports = PotentialCustomers;
