module.exports = (app) => {
    const brands = require("../controller/brands.js");

    let router = require("express").Router();

    
    router.post("/brands", brands.createBrands); // create brands
    // router.get("/brands", brands.findBrands); // read brands
    // router.patch("/brands", brands.updateBrand); // update Brand
    // router.delete("/brands", brands.deleteBrandById); // delete brands by id

    
    app.use("/api", router);
};