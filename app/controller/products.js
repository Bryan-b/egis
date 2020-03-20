const db = require("../models");
const util = require("../utility");
const products = db.products;


exports.createProduct = async (req, res) => {
    const {
      name,
      price,
      quantity,
      category,
      brand,
      index_img,
      mini_desc,
      full_desc,
      specs,
      discount_rate,
      discount_status,
      shipping_fee,
      tax_fee,
      total_rating,
      total_rated_users
} = req.body;



    await products.create(category_data).then(data => {
      return res.status(201).send({
        error : false,
        message : "products successfully created",
        data : data
      }) 
    }).catch(err => {
      return res.status(500).send({
        error : true,
        message : "an error ocurred, please try again later",
        error : err
      })
    })
}