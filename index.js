const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbc = require("./app/config/db.config.js");
const db = require("./app/models");

const app = express();
const port = process.env.PORT || dbc.PORT;
var corsOption = {
  origin: dbc.ORIGIN
};

app.use(fileUpload());
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// ROUTES
require("./app/routes/categories_route")(app);
require("./app/routes/products_route")(app);



app.get("/resync", function(req, res) {
  db.sequelize.authenticate().then(() => {
      console.log("Connection has been established successfully.");
      return res.send({
          error : false,
          message : "working"
      })
    }).catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  db.products.sync({
      force : true
  }).then(() => {
        // db.categories.create({
        //     name : "swimming",
        //     parent_id : 1
        // })
      console.log("Connected To Server and Synced");
  })
});

app.listen(port, () => {
  console.log("connected to server");
});

module.exports = app;
