const db = require("../models");
const categories = db.categories;




// Find All Categories
exports.findCategories = async (req, res) => {
  try{
    await categories.findAll({attributes: {exclude: ['hierarchy_level']},hierarchy: true})
      .then(categories => {
        return res.status(200).send({
          errror : false,
          message: "categories fetched successfully",
          data: categories
        });
      })  
  }catch(error){
    res.status(500).send({
      error : true,
      message: "an error occurred while finding categories.",
    });  
  }
};


// Find Subcategories By Parent Category id
exports.findSubCategoriesById = async (req, res) => {
  let id = req.params.id;
  // validating
  if (!id) return res.status(400).send({error : true, message : "category id required"});
  if (isNaN(id)) return res.status(400).send({error : true, message : "invalid category id sent, expecting an integer"});

  try{
    // find query
    await categories.findOne({
      where: { id : id },
      include: {
        model: categories,
        as: 'descendents',
        hierarchy: true
      }
    }).then(categories => {
      return res.status(200).send({
        errror : false,
        message: "categories fetched successfully",
        data: categories
      });
    })
  }catch(error){
    res.status(500).send({
      error : true,
      message: "an error occurred while finding categories.",
    });
  }
}



// Find Category By Visibility
exports.findCategoriesByVisibilty = async (req, res) => {

  let is_visible = req.params.is_visible;
  // CHECKING IS PARAMS VALUE IS VALID
  if(!isNaN(is_visible) && is_visible <= 1 || is_visible >= 0){
    // FIND CATEGORY BY VISIBILITY
    try{

      await categories.findAll({where : {is_visible : is_visible}, attributes: {exclude: ['is_visible','hierarchy_level']},hierarchy: true})
        .then((categories) => {
          return res.status(200).send({
            error : false,
            message: "Fetched successfully",
            data: categories
          });
        })

    }catch(error){

      res.status(404).send({
        error : false,
        message: "can't find category list"
      });

    }
  }else{
    return res.status(400).send({
      error : false,
      message : "invalid visibility status sent, expecting '1' or '0'"
    })
  }
}




// Create A New Category
exports.createCategory = async (req, res) => {
  const {name, level_id} = req.body;
  let parent_id;

  // CHECK IF NAME IS EXIST AND NOT EMPTY
  if(name == "" || typeof name == "undefined"){
    return res.status(400).send({
        message : "category name required"
    })
  }
  // SETTING LEVEL ID TO "NULL IF NOT SET"
  level_id == "" || typeof level_id == "undefined" ? parent_id = null : parent_id = level_id;
  // DECLARING CATEGORY DATA OBJECT
  let category_data = {
    name,
    parent_id
  }
  
  // CHECK IF THE CATEGORY IS EXISTING WITH SAME "NAME" AND "PARENT_ID"
  let is_exist = await categories.findOne({
    where: {
      name : category_data.name,
      parent_id : category_data.parent_id
    }
  });

  // IF CATEGORY WITH EXACT "NAME" AND "PARENT_ID" DOES NOT EXIST
  if(is_exist === null){

    // IF THE CATEGORY "PARENT_ID" IS A NULL VALUE
    if(category_data.parent_id !== null){

      // CHECK IF "PARENT_ID" IS EXISTING IN THE SERIES OF
      let is_id_exist = await categories.findByPk(category_data.parent_id);
      if(is_id_exist === null){
        // "PARENT_ID" DOES NOT EXIST AS A PRIMARY KEY
        return res.status(400).send({
          error : true,
          message: "invalid id sent"
        });
      }
    }
    
    // AFTER ALL CHECKS, CREATE...
    await categories.create(category_data).then(data => {
      return res.status(201).send({
        error : false,
        message : "category successfully created",
        data : data
      }) 
    }).catch(err => {
      return res.status(500).send({
        error : true,
        message : "an error ocurred, please try again later",
      })
    })

  }else{
    // CATGEORY ALREADY EXIST
    res.status(400).send({
      error : true,
      message : "category already exist in the same level"
    })
  }
}




// Update Category Name By Id
exports.updateCategory = async (req, res) => {
  const {id, name} = req.body;

  // CHECKING IF DATA EXIST OR NOT
  if(!id) return res.status(400).send({error : true, message : "id required"});
  if (!name) return res.status(400).send({error : true, message : "category new name required"});
  
  let updateData = {};

  let is_Available = await categories.findByPk(id);
  if(is_Available === null) {
    return res.status(400).send({
      error : true,
      message : "invalid catgeory id sent"
    })
  }

  // CHECKING IF NAME EXIST
  if (name) {
    let check_name = await categories.findOne({
      where : {
        name,
        parent_id : is_Available.parent_id
      }
    });

    if(check_name !== null){
      return res.status(400).send({
        error: true,
        message: "category name already exist in the same level"
      });
    }else{
      updateData.name = name;

    }
  }

  try {
    await categories.update(updateData, {
      where : {
        id : id
      }
    }).then(data => {
      return res.status(200).send({
        error: false,
        message: "category successfully updated"
      });
    });

  }catch (error) {
    return res.status(500).send({
      error: true,
      message: "an error ocurred, please try again later"
    });
  }
}


exports.updateCategoryVisibility = async (req, res) => {
  const {id, is_visible} = req.body;

  // VALIDATION
  if (!id) return res.status(400).send({ error: true, message: "id required" });
  if (!is_visible) return res.status(400).send({ error: true, message: "visibility status required, expecting '1' or '0'" });
  if(is_visible != 1 && is_visible != 0) return res.status(400).send({ error : true, message : "invalid visibility status sent, expecting '1' or '0'" });

  let isCategoryExist = await categories.findOne({
    where : {
      id
    }
  });

  if (isCategoryExist == null){
    console.log(isCategoryExist)
    return res.status(404).send({
      error : true,
      message : "category not found"
    })

  }else{

    try {
      // MAKE UPDATE
      await categories.update({isVisible : is_visible}, {
        where : {
          id
        }
      }).then(data => {
        return res.status(200).send({
          error: false,
          message: "category successfully updated"
        });
      });
  
    }catch(error) {

      return res.status(400).send({
        error: true,
        message: "an error occurred, please try again later"
      });

    }

  }
}



// Delete Category By Id (one or more)
exports.deleteCategoryById = async (req, res) => {
  const {id} = req.body;
  // VALIDATING
  if(isNaN(id)) return res.status(400).send({error : true, message : "invalid category id sent, expecting an integer"})

  try{
    await categories.destroy({
      where : {
        id : id
      }
    }).then(resp => {
      return res.status(200).send({
        error : false,
        message : "category successfully deleted",
        data : resp
      })
    })
  }catch(error){

    return res.status(400).send({
      error: true,
      message: "an error occurred, please try again later"
    });

  }
}
