module.exports = (app) => {
  const products = require("../controller/products.js");

  let router = require("express").Router();

  router.post("/product", products.createProduct); // create product

  router.get("/product", products.getAllProducts); // get all products

  app.use("/api", router);
};
