"use strict";

const mongoose = require("mongoose");
const Env = use("Env");

mongoose
  .connect(Env.get("MONGO_HOST"), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then()
  .catch((err) => console.log(">>> " + err));
