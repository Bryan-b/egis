module.exports = (app) => {
    const categories = require("../controller/categories.js");

    let router = require("express").Router();

    
    router.post("/categories", categories.createCategory); // create categories
    router.get("/categories", categories.findCategories); // read categories
    router.patch("/categories", categories.updateCategory); // update category
    router.delete("/categories", categories.deleteCategoryById); // delete categories by id
    router.get("/categories/:is_visible", categories.findCategoriesByVisibilty); // get categories by visibility
    router.patch("/categories_visibility", categories.updateCategoryVisibility); // update category visibility
    router.get("/sub_categories/:id", categories.findSubCategoriesById); // find categories by id
    
    
    app.use("/api", router);
};
