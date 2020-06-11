const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/taxia-technical", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then()
  .catch((err) => console.log(">>> " + err));
