module.exports = (app) => {
    const categories = require("../controller/categories.js");

    let router = require("express").Router();

    
    router.get("/categories", categories.findCategories); // get categories
    router.post("/categories", categories.createCategory); // create categories
    router.get("/categories/:is_visible", categories.findCategoriesByVisibilty); // get categories by visibility
    router.patch("/categories", categories.updateCategory); // update category

    app.use("/api", router);
};
