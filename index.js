const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const {PORT, ORIGIN} = require("./app/config");
const db = require("./app/models");

const app = express();
const port = process.env.PORT || PORT;
var corsOption = {
  origin: ORIGIN
};

app.use(fileUpload());
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use( express.static(path.join(__dirname, "app/files")));

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
      // console.log(__dirname)
    console.log("connected to server");
  });

module.exports = app;
