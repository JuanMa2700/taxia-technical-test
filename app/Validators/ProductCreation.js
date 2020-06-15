"use strict";

class ProductCreation {
  get rules() {
    return {
      name: "required|string",
      description: "required|string",
      price: "required|number",
      stock: "required|number",
    };
  }
  get messages() {
    return {
      "name.string": "The name must be a string",
      "name.required": "You must provide a name",
      "description.string": "The description must be a string",
      "description.required": "You must provide a description",
      "price.string": "The price must be a valid number",
      "price.required": "You must provide a price",
      "stock.string": "The stock must be a number",
      "stock.required": "You must provide a stock",
    };
  }
}

module.exports = ProductCreation;
