module.exports = (app) => {
    const brands = require("../controller/brands.js");

    let router = require("express").Router();

    
    router.post("/brands", brands.createBrands); // create brands
    router.get("/brands", brands.listBrands); // read brands
    router.patch("/brands", brands.updateBrands); // update Brand
    router.delete("/brands/:id", brands.deleteBrands); // delete brands by id

    
    app.use("/api", router);
};