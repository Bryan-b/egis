module.exports = (app) => {
  const products = require("../controller/products.js");

  let router = require("express").Router();

  router.post("/product", products.createProduct); // create product
  router.get("/product", products.getAllProducts); // get all products
  router.get("/product/:category", products.productByCategory); // get all products by category
  router.get("/product/:category/:brand", products.productByCategoryAndBrand); // get all products by category and brand

  app.use("/api", router);
};
