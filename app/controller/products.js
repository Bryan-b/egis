const { products, product_images, product_resources } = require("../models");
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
    
    //Product Files
    const image_file = req.files.image_file;
    const resource_file = req.files.resource_file;
    const demo_video = req.files.demo_video;

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


                    // saving resource files to storage
                    if(resource_file){
                        resource_file_length = resource_file.length;
                        resource_array = [];

                       if(resource_file_length == undefined){
                            // single resource file
                            let r_file_size = util.fileSizeCheck(resource_file.size)
                            let r_file_ext = resource_file.name.split(".").slice(-1)[0];
                            let r_file_name = resource_file.name.split(".").slice(0, -1).join(" ");
                            let r_new_name = r_file_name + "_" + uniqueId + Date.now() + "." + r_file_ext;
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
                                let r_new_name = r_file_name + "_" + uniqueId + Date.now() + "." + r_file_ext;
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



// list all available product(paginate)
exports.getAllProducts = async (req, res) => {
    let page = req.query.page

    try{
        if(page && isNaN(page)) throw "invalid query sent"
        if(page == undefined) page = 1;

        // setting pagination configuration
        let limit = dataNeed.paginate.limit;
        let total_product_count = await products.count({ where: { visibility: 1 }});
        let total_pages = Math.ceil(total_product_count / limit);
        let offset = ((page - 1) * limit);
        let countData = {
          where: {
            visibility: 1
          },
          limit: limit,
          attributes: ["id","unique_id", "name", "price", "quantity", "category", "brand", "discount_rate", "discount_status"]
        };
        if(offset > 0) countData.offset = offset
        await products.findAll(countData).then((data) => {
            res.status(200).send({
                error : false,
                message : "products fetched successfully",
                page : parseInt(page),
                total_page : total_pages, 
                data : data
            })
        })
    } catch (error) {
        res.send({
        error: true,
        message: error || "an error occurred while fetching products"
        });
    }

    // TODO
    // list product by category
    // list product by brand
    // list product by search (findings)
}

// update product
// delete product
// add product image
// update product image
// delete product image
// add resource file
// update resource file
// delete resource file
// add demo video
// update demo video
// delete demo video
// create brand
// update brand
// delete brand
// list brand