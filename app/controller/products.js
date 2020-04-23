const { products, product_images, product_resources, categories, brands, Op, sequelize, Sequelize } = require("../models");
const util = require("../utility");
const { ORIGIN } = require("../config");
const dataNeed = require("../utility/data");

// create product
exports.createProduct = async (req, res) => {
    const {
      name,
      price,
      quantity,
      category,
      brand,
      type,
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
    if(util.isntOrEmpty(type)) return res.status(400).send({error : true, message : "product type required"});
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
    
    // Validating 'brands' and 'category'
    let validCategoryId = await categories.findByPk(category);
    let validBrandId = await brands.findByPk(brand);
    if (validCategoryId === null) return res.status(400).send({error : true, message : "category selected does not exist"});
    if (validBrandId === null) return res.status(400).send({error : true, message : `brand selected does not exist`});

    //Product Files
    const {image_file, resource_file, demo_video} = req.files;

    let valid_image = util.isntOrNotImage(image_file);
    let valid_resource = util.isntOrNotDoc(resource_file);
    let valid_demo = util.isntOrNotVideo(demo_video);

    if(valid_image.error){ 
        return res.status(400).send({
            error : true,
            message : valid_image.message
        });
    }else if(valid_resource.message && valid_resource.message != null){
        return res.status(400).send({
            error : true,
            message : valid_resource.message
        });
    }else if(valid_demo.message && valid_demo.message != null){
        return res.status(400).send({
            error : true,
            message : valid_demo.message
        });
    }else{

        // product creation begins here
        let product_details = {
            name,
            price,
            quantity,
            category,
            brand,
            type,
            mini_description: mini_desc,
            full_description: full_desc,
            specifications: specs,
            shipping_fee,
            tax_fee
        };

        // demo video present
        if(demo_video){
            // single demo video
            demo_video.name = "." + demo_video.name.split(".").slice(-1)[0];
            let demoNewName = Date.now() + "_egis_product" + demo_video.name;
            demo_video.mv("./app/files/videos/" + demoNewName);
            let demo_video_url = ORIGIN + "/videos/" + demoNewName;
            product_details.demo = demo_video_url;
        }

        // checking and setting discount status and rate
        if(discount_status && discount_status != 0){
            product_details.discount_status = '1';
            product_details.discount_rate = discount_rate;
        }

        try {
            await products.create(product_details)
                .then(new_item => {
                    let productId = new_item.dataValues.id;
                    let uniqueId = new_item.dataValues.unique_id;
                    
                    let image_file_length = image_file.length;
                    let image_array = [];

                    let resource_file_length;
                    let resource_array;
    
                    // Saving images to file storage
                    if (image_file_length == undefined){
                        // single image file
                        image_file.name = "." + image_file.name.split(".").slice(-1)[0];
                        let newName = uniqueId + '_' + Date.now() + image_file.name;
                        image_file.mv("./app/files/images/" + newName);
                        let product_image_url = ORIGIN + "/images/" + newName;
                        image_array.push({
                            product_image_url,
                            productId
                        });
                    }else{
                        // multiple image file
                        image_file.map(one_file => {
                            one_file.name = "." + one_file.name.split(".").slice(-1)[0];
                            let newName = uniqueId + '_' + Date.now() + one_file.name.replace(" ","");
                            one_file.mv(`./app/files/images/` + newName);
                            let product_image_url = ORIGIN + "/images/" + newName
                            image_array.push({
                              product_image_url,
                              productId
                            });
                        })
                    }


                    // saving resource files to storage
                    if(resource_file){
                        resource_file_length = resource_file.length;
                        resource_array = [];

                       if(resource_file_length == undefined){
                            // single resource file
                            let r_file_size = util.fileSizeCheck(resource_file.size)
                            let r_file_ext = resource_file.name.split(".").slice(-1)[0];
                            let r_file_name = resource_file.name.split(".").slice(0, -1).join(" ");
                            let r_new_name = uniqueId + '_' + Date.now() + "." + r_file_ext;
                            resource_file.mv("./app/files/resources/" + r_new_name);
                            let resource_url = ORIGIN + "/resources/" + r_new_name;
                            resource_array.push({
                                resource_name : r_file_name + '_' + uniqueId,
                                resource_type : r_file_ext,
                                resource_size : r_file_size,
                                resource_url,
                                productId
                            });
                       }else{

                            resource_file.map( eachFile => {
                                let r_file_size = util.fileSizeCheck(eachFile.size)
                                let r_file_ext = eachFile.name.split(".").slice(-1)[0];
                                let r_file_name = eachFile.name.split(".").slice(0, -1).join(" ");
                                let r_new_name = uniqueId + '_' + Date.now() + "." + r_file_ext;
                                eachFile.mv("./app/files/resources/" + r_new_name);
                                let resource_url = ORIGIN + "/resources/" + r_new_name;
                                resource_array.push({
                                    resource_name : r_file_name + "-" + uniqueId,
                                    resource_type : r_file_ext,
                                    resource_size : r_file_size,
                                    resource_url,
                                    productId
                                });
                            })
                       }
                    }


    
                    //product image insertion
                    product_images.bulkCreate(image_array).then(() => {
                        if (resource_array && resource_array.length > 0) {
                            product_resources.bulkCreate(resource_array).then(() => {
                                products.findAll({
                                    where : {
                                        id : productId
                                    },
                                    include : [
                                        {
                                            model : product_images,
                                            attributes : { exclude : ['createdAt', 'updatedAt', 'productId']}
                                        },
                                        {
                                            model : product_resources,
                                            attributes : { exclude : ['createdAt', 'updatedAt', 'productId']}
                                        }
                                    ]
                                }).then(data => {
                                    res.send({
                                        error : false,
                                        message : "product created successfully",
                                        data : data
                                    })
                                })
                            })
                        }else{
                            products.findAll({
                                where : {
                                    id : productId
                                },
                                include : [
                                    {
                                        model : product_images,
                                        attributes : { exclude : ['createdAt', 'updatedAt', 'productId']}
                                    },
                                    {
                                        model : product_resources,
                                        attributes : { exclude : ['createdAt', 'updatedAt', 'productId']}
                                    }
                                ]
                            }).then(data => {
                                res.send({
                                    error : false,
                                    message : "product created successfully",
                                    data : data
                                })
                            })
                        }
                    })
    
                })
            
        } catch (error) {
            res.status(400).send({
                error : true,
                message: "an error occurred while creating product."
            });
        }


    }

}



// list all available product(paginate) or search
exports.getAllProducts = async (req, res) => {
    let {page, q} = req.query;

    try{
        // Query parameter validation
        if(req.body.hasOwnProperty(page) && isNaN(page) || page == '') throw "invalid or empty page query sent"
        if(page == undefined) page = 1;
        if(q && typeof(q) == String) throw "invalid or empty type query sent";

        // setting pagination configuration
        let limit = dataNeed.paginate.limit;
        let offset = ((page - 1) * limit);
        let countData = {
          where: {
            visibility: 1
          },
          limit: limit,
          attributes: dataNeed.productData
        };
        if(q) {
            countData = {
                where: {
                    visibility: 1,
                    name : {
                        [Op.substring]: q
                    }
                },
                limit: limit,
                attributes: dataNeed.productData
            };
        }
        if(offset > 0) countData.offset = offset;
        await products.findAndCountAll(countData).then((data) => {
            res.status(200).send({
                error : false,
                message : "products fetched successfully",
                total_item : data.count,
                page : parseInt(page) || 1,
                total_page : Math.ceil(data.count / limit), 
                data : data.rows
            })
        })
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred while fetching products"
        });
    }
}


// view product info
exports.viewProduct = async (req, res) => {
    let {id} = req.params;

    try {
        if(util.isntOrEmptyOrNaN(id)) throw 'valid product id required';

        let productInfo = await products.findOne({
            where: { id },
            include: [
                {
                    model: product_images,
                    attributes: { exclude: ["createdAt", "updatedAt", "productId"] }
                },
                {
                    model: product_resources,
                    attributes: { exclude: ["createdAt", "updatedAt", "productId"] }
                }
            ],
            attributes: dataNeed.productData
        });

        if(productInfo === null) throw `product with id ${id} does not exist`;

        res.status(200).send({
            error: true,
            message: "product info fetched successfully",
            data : productInfo
        })
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred while fetching product info"
        });
    }
}


// list all available products by category
exports.productByCategory = async (req, res) => {
    let {category} = req.params;
    let {page} = req.query;
    
    try {
        if(category && category == '') throw "invalid category sent";
        if(page && isNaN(page) || page == '') throw "invalid or empty page query sent"
        if(page == undefined) page = 1;

        let limit = dataNeed.paginate.limit;
        let offset = ((page - 1) * limit);
        
        // modifying product data array to suit raw query
        let q = [];
        dataNeed.productData.map(e => {q.push(`p.${e}`)})
        let query = 'SELECT ' + [...q] + ' FROM `products` AS p INNER JOIN `categories` AS c ON c.`id` = p.`category` WHERE p.visibility = 1 AND c.is_visible = 1 AND c.`name` = ' + `"${category}"`
        let query_count = 'SELECT COUNT(*) AS count FROM `products` AS p INNER JOIN `categories` AS c ON c.`id` = p.`category` WHERE p.visibility = 1 AND c.is_visible = 1 AND c.`name` = ' + `"${category}"`
        let options = query + ' LIMIT ' + limit + ' OFFSET ' + offset
        let count = await sequelize.query(query_count, {type : sequelize.QueryTypes.SELECT}).then(c => c[0].count)
        await sequelize.query(options, {type : sequelize.QueryTypes.SELECT})
            .then((data) => {
                res.status(200).send({
                    error : false,
                    message : "products fetched successfully",
                    total_item : count,
                    page : parseInt(page) || 1,
                    total_page : Math.ceil(count / limit),
                    data : data
                })
            })
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred while fetching products"
        });
    }
}


// list all available products by category and brand
exports.productByCategoryAndBrand = async (req, res) => {
    let {category, brand} = req.params;
    let {page} = req.query;

    try{
        if(category && category == '') throw "invalid category sent";
        if(brand && brand == '') throw "invalid brand sent";
        if(page && isNaN(page) || page == '') throw "invalid or empty page query sent"
        if(page == undefined) page = 1;

        let limit = dataNeed.paginate.limit;
        let offset = (page - 1) * limit;

        // modifying product data array to suit raw query
        let q = [];
        dataNeed.productData.map(e => {q.push(`p.${e}`)})
        let query = 'SELECT ' + [...q] + ' FROM `products` AS p INNER JOIN `categories` AS c ON c.`id` = p.`category` INNER JOIN `brands` AS b ON b.`id` = p.`brand` WHERE p.visibility = 1 AND c.is_visible = 1 AND c.`name` = ' + `"${category}"` + ' AND b.`name` = ' + `"${brand}"`
        let query_count = 'SELECT COUNT(*) AS count FROM `products` AS p INNER JOIN `categories` AS c ON c.`id` = p.`category` INNER JOIN `brands` AS b ON b.`id` = p.`brand` WHERE p.visibility = 1 AND c.is_visible = 1 AND c.`name` = ' + `"${category}"` + ' AND b.`name` = ' + `"${brand}"`
        let options = query + ' LIMIT ' + limit + ' OFFSET ' + offset
        let count = await sequelize.query(query_count, {type : sequelize.QueryTypes.SELECT}).then(c => c[0].count)
        await sequelize.query(options, {type : sequelize.QueryTypes.SELECT})
            .then((data) => {
                res.status(200).send({
                    error : false,
                    message : "products fetched successfully",
                    total_item : count,
                    page : parseInt(page) || 1,
                    total_page : Math.ceil(count / limit),
                    data : data
                })
            })
    } catch (error){
        res.send({
            error: true,
            message: error || "an error occurred while fetching products"
        })
    }
}


// list all products by brand
exports.productByBrand = async (req, res) => {
    let { brand } = req.params;
    let { page } = req.query;

    try{
        if(brand && brand == '') throw "invalid brand sent";
        if(page && isNaN(page) || page == '') throw "invalid or empty page query sent"
        if(page == undefined) page = 1;

        let limit = dataNeed.paginate.limit;
        let offset = (page - 1) * limit;

        // modifying product data array to suit raw query
        let q = [];
        dataNeed.productData.map(e => {q.push(`p.${e}`)})
        let query = 'SELECT ' + [...q] + ' FROM `products` AS p INNER JOIN `brands` AS b ON b.`id` = p.`brand` WHERE p.visibility = 1 AND b.`name` = ' + `"${brand}"`
        let query_count = 'SELECT COUNT(*) AS count FROM `products` AS p INNER JOIN `brands` AS b ON b.`id` = p.`brand` WHERE p.visibility = 1 AND b.`name` = ' + `"${brand}"`
        let options = query + ' LIMIT ' + limit + ' OFFSET ' + offset
        let count = await sequelize.query(query_count, {type : sequelize.QueryTypes.SELECT}).then(c => c[0].count)
        await sequelize.query(options, {type : sequelize.QueryTypes.SELECT})
            .then((data) => {
                res.status(200).send({
                    error : false,
                    message : "products fetched successfully",
                    total_item : count,
                    page : parseInt(page) || 1,
                    total_page : Math.ceil(count / limit),
                    data : data
                })
            })
    } catch (error){
        res.send({
            error: true,
            message: error || "an error occurred while fetching products"
        })
    }
}


// update product
exports.updateProduct = async (req, res) => {
    let product_update = {}

    try {
        // Setting new details if available
        let {unique_id} = req.body;
        if(req.body.hasOwnProperty('unique_id')){
            if(util.isntOrEmpty(unique_id)) throw 'invalid product id';
            if(await products.findOne({where:{unique_id}}) === null) throw "product id sent does not exist";
        }

        if(req.body.hasOwnProperty('name')){
            let {name} = req.body;
            if(util.isntOrEmpty(name)) throw 'product name cannot be empty';
            product_update.name = name;
        }
        
        if(req.body.hasOwnProperty('price')){
            let {price} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(price))) throw 'product price cannot be empty';
            product_update.price = price;
        }

        if(req.body.hasOwnProperty('quantity')){
            let {quantity} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(quantity))) throw 'product quantity cannot be empty';
            product_update.quantity = quantity;
        } 

        if(req.body.hasOwnProperty('category')){
            let {category} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(category))) throw 'product category cannot be empty';
            if(await categories.findByPk(category) === null) throw 'category id sent does not exist';
            product_update.category = category;
        } 

        if(req.body.hasOwnProperty('brand')){
            let {brand} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(brand))) throw 'product brand cannot be empty';
            if(await brands.findByPk(brand) === null) throw 'brand id sent does not exist';
            product_update.brand = brand;
        } 

        if(req.body.hasOwnProperty('type')){
            let {type} = req.body;
            if(util.isntOrEmpty(util.trim(type))) throw 'product type cannot be empty';
            product_update.type = type;
        }

        if(req.body.hasOwnProperty('mini_desc')){
            let {mini_desc} = req.body;
            if(util.isntOrEmpty(util.trim(mini_desc))) throw 'product mini description cannot be empty';
            product_update.mini_description = mini_desc;
        }

        if(req.body.hasOwnProperty('full_desc')){
            let {full_desc} = req.body;
            if(util.isntOrEmpty(util.trim(full_desc))) throw 'product full description cannot be empty';
            product_update.full_description = full_desc;
        } 
        
        if(req.body.hasOwnProperty('specs')){
            let {specs} = req.body;
            if(util.isntOrEmpty(util.trim(specs))) throw 'product specifications cannot be empty';
            product_update.specifications = specs;
        }

        if(req.body.hasOwnProperty('discount_status')){
            let {discount_status} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(discount_status))) throw 'discount status cannot be empty';
            product_update.discount_status = discount_status;
        }

        if(req.body.hasOwnProperty('discount_rate')){
            let {discount_rate} = req.body
            if(util.isntOrEmptyOrNaN(util.trim(discount_rate))) throw 'discount rate cannot be empty';
            product_update.discount_rate = discount_rate;
        }

        if(req.body.hasOwnProperty('shipping_fee')){
            let {shipping_fee} = req.body;
            if(util.isntOrEmptyOrNaN(util.trim(shipping_fee))) throw 'shipping fee cannot be empty';
            product_update.shipping_fee = shipping_fee;
        } 

        if(req.body.hasOwnProperty('tax_fee')) {
            let {tax_fee} = req.body;
            if(util.isntOrEmpty(util.trim(tax_fee))) throw 'tax fee cannot be empty';
            product_update.tax_fee = tax_fee;
        }
    
        // checking if any update
        if(Object.keys(product_update).length < 1) throw 'nothing to update';

        let updateProduct = await products.update(product_update, {where : {unique_id}});
        if(updateProduct){
            res.status(200).send({
                error : false,
                message : 'product updated successfully'
            })
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error || "an error occurred updating product"
        });
    }
}


// add product image(s)
exports.addProductImage = async (req, res) => {
    const {image_file} = req.files;
    const {id} = req.body;
    
    try {
        if(util.isntOrEmpty(id)) throw 'product id cannot be empty'
        if(await products.findOne({where:{id}}) === null) throw 'product id sent does not exist'

        let valid_image = util.isntOrNotImage(image_file);
    
        if(valid_image.error) throw valid_image.message
        
        let image_file_length = image_file.length;
        let image_array = [];
        let productId = id
    
        // Saving images to file storage
        if (image_file_length == undefined){
            // single image file
            image_file.name = "." + image_file.name.split(".").slice(-1)[0];
            let newName = Date.now() + "_egis_product" + image_file.name;
            image_file.mv("./app/files/images/" + newName);
            let product_image_url = ORIGIN + "/images/" + newName;
            image_array.push({
                product_image_url,
                productId
            });
        }else{
            // multiple image file
            image_file.map(one_file => {
                one_file.name = "." + one_file.name.split(".").slice(-1)[0];
                let newName = Date.now() + "_egis_product" + one_file.name.replace(" ","");
                one_file.mv(`./app/files/images/` + newName);
                let product_image_url = ORIGIN + "/images/" + newName
                image_array.push({
                    product_image_url,
                    productId
                });
            })
        }
    
        product_images.bulkCreate(image_array).then(() => {
            product_images.findAll({
                where : {productId},
                attributes: { exclude: ["createdAt", "updatedAt", "productId"] }
            }).then(data => {
                res.send({
                    error : false,
                    message : "product images inserted successfully",
                    data : data
                })
            }) 
        })
        
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred inserting product image(s)"
        });
    }
}


// update product image
exports.updateProductImage = async (req, res) => {
    const {image_file} = req.files;
    const {image_id} = req.body;
    
    try {
        if(util.isntOrEmpty(image_id)) throw 'product image id cannot be empty'
        if(await product_images.findOne({where:{id:image_id}}) === null) throw 'product image id sent does not exist'

        let valid_image = util.isntOrNotImage(image_file);
    
        if(valid_image.error) throw valid_image.message
        
        let image_file_length = image_file.length;
    
        // Saving images to file storage
        if (image_file_length != undefined) throw "only one image file is expected";
    
        // single image file
        image_file.name = "." + image_file.name.split(".").slice(-1)[0];
        let newName = Date.now() + "_egis_product" + image_file.name;
        image_file.mv("./app/files/images/" + newName);
        let product_image_url = ORIGIN + "/images/" + newName;
    
        product_images.update({product_image_url},{where:{id:image_id}}).then(() => {
            product_images.findOne({
                where : {id : image_id},
                attributes: { exclude: ["createdAt", "updatedAt", "productId"] }
            }).then(data => {
                res.send({
                    error : false,
                    message : "product images updated successfully",
                    data : data
                })
            }) 
        })
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred updating product"
        });
    }
}


// delete product image
exports.deleteProductImage = async (req, res) => {
    let {id} = req.params

    try {
        if(util.isntOrEmptyOrNaN(id)) throw "invalid or empty number sent";

        let isValidId = await product_images.findByPk(id)
        if(isValidId !== null){
            let delProductImage = await product_images.destroy({where : {id}})

            if(delProductImage){
                res.status(200).send({
                    error: true,
                    message: `product image with id ${id} deleted successfully`
                });
            }
        }else{
            throw `product image with id ${id} does not exist`;
        } 
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred deleting product image"
        });
    }
}


// add product resource file(s)
exports.addProductResource = async (req, res) => {
    const {resource_file} = req.files;
    const {id} = req.body;
    
    try {
        if(util.isntOrEmpty(id)) throw 'product id cannot be empty'
        let checkProduct = await products.findByPk(id)
        if(checkProduct === null) throw 'product id sent does not exist'

        let uniqueId = checkProduct.dataValues.unique_id
        let valid_file = util.isntOrNotDoc(resource_file);
        let productId = id;
    
        if(valid_file.error) throw valid_file.message;
        
        let resource_file_length = resource_file.length;
        let resource_array = [];

        if(resource_file_length == undefined){
            // single resource file
            let r_file_size = util.fileSizeCheck(resource_file.size)
            let r_file_ext = resource_file.name.split(".").slice(-1)[0];
            let r_file_name = resource_file.name.split(".").slice(0, -1).join(" ");
            console.log("yes")
            let r_new_name = uniqueId + '_' + Date.now() + "." + r_file_ext;
            resource_file.mv("./app/files/resources/" + r_new_name);
            let resource_url = ORIGIN + "/resources/" + r_new_name;
            resource_array.push({
                resource_name : r_file_name + '_' + uniqueId,
                resource_type : r_file_ext,
                resource_size : r_file_size,
                resource_url,
                productId
            });
        }else{

            resource_file.map( eachFile => {
                let r_file_size = util.fileSizeCheck(eachFile.size)
                let r_file_ext = eachFile.name.split(".").slice(-1)[0];
                let r_file_name = eachFile.name.split(".").slice(0, -1).join(" ");
                let r_new_name = uniqueId + '_' + Date.now() + "." + r_file_ext;
                eachFile.mv("./app/files/resources/" + r_new_name);
                let resource_url = ORIGIN + "/resources/" + r_new_name;
                resource_array.push({
                    resource_name : r_file_name + "-" + uniqueId,
                    resource_type : r_file_ext,
                    resource_size : r_file_size,
                    resource_url,
                    productId
                });
            })
        }
                console.log(resource_array);
        product_resources.bulkCreate(resource_array).then(() => {
            product_resources.findAll({
                where : {productId},
                attributes: { exclude: ["createdAt", "updatedAt", "productId"] }
            }).then(data => {
                res.send({
                    error : false,
                    message : "product resource file inserted successfully",
                    data : data
                })
            }) 
        })
        
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred inserting product resource file"
        });
    }
}


// delete product
exports.deleteProduct = async (req, res) => {
    let {id} = req.params

    try {
        if(util.isntOrEmptyOrNaN(id)) throw "invalid or empty number sent";

        let isValidId = await products.findByPk(id)
        if(isValidId !== null){
            let delProduct = await products.destroy({where : {id}})

            if(delProduct){
                res.status(200).send({
                    error: true,
                    message: `product with id ${id} deleted successfully`
                });
            }
        }else{
            throw `product with id ${id} does not exist`;
        }   
    } catch (error) {
        res.send({
            error: true,
            message: error || "an error occurred deleting product"
        });
    }
}



// TODO

// add resource file
// update resource file
// delete resource file
// add demo video
// update demo video
// delete demo video