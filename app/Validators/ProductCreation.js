"use strict";

class ProductCreation {
  get rules() {
    return {
      name: "required|string",
      price: "required|number",
      stock: "required|number",
    };
  }
  get messages() {
    return {
      "name.string": "The name must be a string",
      "name.required": "You must provide a name",
      "price.string": "The price must be a valid number",
      "price.required": "You must provide a price",
      "stock.string": "The stock must be a number",
      "stock.required": "You must provide a stock",
    };
  }
}

module.exports = ProductCreation;
