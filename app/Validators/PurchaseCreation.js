"use strict";

class PurchaseCreation {
  get rules() {
    return {
      product_id: "required|number",
      longitude: "required|number",
      latitude: "required|number",
    };
  }
  get messages() {
    return {
      "product_id.number": "The product id must be a number.",
      "product_id.required": "You must provide a product id",
      "longitude.number": "The longitude must be a number",
      "longitude.required": "You must provide a longitude",
      "latitude.number": "The latitude must be a number",
      "latitude.required": "You must provide a latitude",
    };
  }
}

module.exports = PurchaseCreation;
