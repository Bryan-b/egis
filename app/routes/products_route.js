module.exports = (app) => {
  const products = require("../controller/products.js");

  let router = require("express").Router();

  router.post("/product", products.createProduct); // create product
  router.get("/product", products.getAllProducts); // get all products or search
  router.get("/productView/:id", products.viewProduct); // view all product info
  router.get("/product/:category", products.productByCategory); // get all products by category alone
  router.get("/product/:category/:brand", products.productByCategoryAndBrand); // get all products by category and brand
  router.get("/productBrand/:brand", products.productByBrand); // get all products by brand alone
  router.patch("/product", products.updateProduct); // update product information
  router.post("/productImage", products.addProductImage); // add product images
  router.patch("/productImage", products.updateProductImage); // update product images
  router.delete("/productImage/:id", products.deleteProductImage); // delete product images
  router.delete("/product/:id", products.deleteProduct); //delete product by id
  router.post("/productResource", products.addProductResource); // add product resource

  app.use("/api", router);
};
