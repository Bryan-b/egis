const db = require("../models");
const util = require("../utility");
const categories = db.categories;


exports.createBrands = async (req, res) => {
    console.log(req.body)
    // const { name } = req.body;

    // try {
    //     if(util.isntOrEmpty(name)) throw "brand name required";

    //     let [brand, created] = await brands.findOrCreate({
    //         where : {
    //             name : util.sanitize(name)
    //         },
    //         defaults : {
    //             name : util.sanitize(name)
    //         }
    //     });

    //     if(created) console.log('created');
        
    // } catch (error) {
    //     res.status(500).send({
    //       error: true,
    //       message: error || "an error occurred creating brand"
    //     });
    // }
}

// exports.findCategories = async (req, res) => {
//   try{
//     await categories.findAll({attributes: {exclude: ['hierarchy_level']},hierarchy: true})
//       .then(categories => {
//         return res.status(200).send({
//           errror : false,
//           message: "categories fetched successfully",
//           data: categories
//         });
//       })  
//   }catch(error){
//     res.status(500).send({
//       error : true,
//       message: "an error occurred while finding categories.",
//     });  
//   }
// };