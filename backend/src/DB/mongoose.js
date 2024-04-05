const mongoose = require("mongoose");
require("dotenv").config({
  path:
    process.env.NODE_ENV === "test" ? "./config/test.env" : "./config/dev.env",
});
//require("dotenv").config({ path: "./config/test.env" });

//Connect to MongoDB
const dburi = process.env.MONGODB_URL;

mongoose
  .connect(dburi)
  .then((result) => {
    console.log("Connected to DB" + dburi);
  })
  .catch((err) => console.log(err));
