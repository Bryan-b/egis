const { products, product_images } = require("../models");
const util = require("../utility");
const { ORIGIN } = require("../config");


exports.createProduct = async (req, res) => {
    const {
      name,
      price,
      quantity,
      category,
      brand,
      mini_desc,
      full_desc,
      specs,
      discount_rate,
      discount_status,
      shipping_fee,
      tax_fee
    } = req.body;
    
    // validation
    if(util.isntOrEmpty(name)) return res.status(400).send({error : true, message : "product name required"});
    if(util.isntOrEmptyOrNaN(price)) return res.status(400).send({error : true, message : "product price required, expecting an integer value"});
    if(util.isntOrEmptyOrNaN(quantity)) return res.status(400).send({error : true, message : "product quantity required, expecting an integer value"});
    if(util.isntOrEmptyOrNaN(category)) return res.status(400).send({error : true, message : "product category required, expecting an integer value"});
    if(util.isntOrEmptyOrNaN(brand)) return res.status(400).send({error : true, message : "product brand required, expecting an integer value"});
    if(util.isntOrEmpty(mini_desc)) return res.status(400).send({error : true, message : "product mini description required"});
    if(util.isntOrEmpty(full_desc)) return res.status(400).send({error : true, message : "product full desc required"});
    if(util.isntOrEmptyOrNaN(quantity)) return res.status(400).send({error : true, message : "product quantity required, expecting an integer value"});
    if(util.isntOrEmpty(specs)) return res.status(400).send({error : true, message : "product specification required"});
    if(!util.isntOrEmptyOrNaN(discount_status) && discount_status == 1){
        if(util.isntOrEmptyOrNaN(discount_rate)) return res.status(400).send({error : true, message : "product discount rate required, expecting an integer value"});
    }
    if(util.isntOrEmptyOrNaN(shipping_fee)) return res.status(400).send({error : true, message : "product shipping fee required, expecting an integer value"});
    if(util.isntOrEmptyOrNaN(tax_fee)) return res.status(400).send({error : true, message : "product tax fee required, expecting an integer value"});
    if(util.isntOrEmpty(req.files)) return res.status(400).send({error : true, message : "product image required"});
    
    const image_file = req.files.image_file;
    let valid_image = util.isntOrNotImage(image_file);
    if(valid_image.error){ 
        return res.status(400).send({
            error : true,
            message : valid_image.message
        });
    }else{

        // product creation begins here
        let product_details = {
          name,
          price,
          quantity,
          category,
          brand,
          mini_description: mini_desc,
          full_description: full_desc,
          specifications: specs,
          shipping_fee,
          tax_fee
        };

        // checking and setting discount status and rate
        if(discount_status && discount_status != 0){
            product_details.discount_status = '1';
            product_details.discount_rate = discount_rate;
        }

        try {
            await products.create(product_details)
                .then(new_item => {
                    let productId = new_item.dataValues.id;
                    
                    let image_file_length = image_file.length;
                    let image_array = [];
    
                    // Saving to file storage
                    if (image_file_length == undefined){
                        image_file.name = "." + image_file.name.split(".").slice(-1)[0];
                        let newName = Date.now() + "_egis_product" + image_file.name;
                        image_file.mv("./app/files/images/" + newName)
                        let product_image_url = ORIGIN + "/images" + "/" + newName;
                        image_array.push({
                            product_image_url,
                            productId
                        });
                    }else{
                        image_file.map(one_file => {
                            one_file.name = "." + one_file.name.split(".").slice(-1)[0];
                            let newName = Date.now() + "_egis_product" + one_file.name.replace(" ","");
                            one_file.mv(`./app/files/images/` + newName)
                            let product_image_url = ORIGIN + "/images" + "/" + newName
                            image_array.push({
                              product_image_url,
                              productId
                            });
                        })
                    }
    
                    //product image insertion
                    product_images.bulkCreate(image_array).then(done => {
                        products.findAll({
                            where : {
                                id : productId
                            },
                            include : [{
                                model : product_images,
                                attributes : { exclude : ['createdAt', 'updatedAt', 'productId']}
                            }]
                        }).then(data => {
                            res.send({
                                error : false,
                                message : "product created successfully",
                                data : data
                            })
                        })
                    })
    
                })
            
        } catch (error) {
            res.send({
                error : true,
                message: "an error occurred creating product."
            });
        }


    }

}