module.exports = (app) => {
  const products = require("../controller/products.js");

  let router = require("express").Router();

  router.post("/product", products.createProduct); // create product

  router.get("/product", products.getAllProducts); // get all products

  router.get("/product/:category", products.productCategories); // get all products by category

  app.use("/api", router);
};;
