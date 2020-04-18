// module.exports = (app) => {
//   const categories = require("../controller/categories.js");
//   const brands = require("../controller/brands.js");
//   const products = require("../controller/products.js");

//   let router = require("express").Router();

  
//   //--------------------------//
//   //-----CATEGORIES ROUTE-----//
//   //--------------------------//
//   router.post("/categories", categories.createCategory); // create categories
//   router.get("/categories", categories.findCategories); // read categories
//   router.patch("/categories", categories.updateCategory); // update category
//   router.delete("/categories", categories.deleteCategoryById); // delete categories by id
//   router.get("/categories/:is_visible", categories.findCategoriesByVisibilty); // get categories by visibility
//   router.patch("/categories_visibility", categories.updateCategoryVisibility); // update category visibility
//   router.get("/sub_categories/:id", categories.findSubCategoriesById); // find categories by id


//   //---------------------------//
//   //-----PRODUCTS ROUTE--------//
//   //---------------------------//
//   router.post("/product", products.createProduct); // create product
//   router.get("/product", products.getAllProducts); // get all products
//   router.get("/product/:category", products.productCategories); // get all products by category


//   //---------------------------//
//   //--------BRANDS ROUTE-------//
//   //---------------------------//
//   router.post("/brands", brands.createBrands); // create brands
//   // router.get("/brands", brands.findBrands); // read brands
//   // router.patch("/brands", brands.updateBrand); // update Brand
//   // router.delete("/brands", brands.deleteBrandById); // delete brands by id
//   // router.post("/brands", brands.createBrands);

//   app.use("/api", router);
// };;
