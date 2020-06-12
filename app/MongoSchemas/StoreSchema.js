const mongoose = require("mongoose");
const { Schema } = mongoose;

const polygonSchema = new Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true,
  },
});

const StoreSchema = new Schema({
  store_id: { type: Number, required: true },
  location: { type: polygonSchema, required: true },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Store", StoreSchema);
