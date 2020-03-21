
const db = require("../models");
const util = require("../utility");
const products = db.products;
const { ORIGIN } = require("../config");


exports.createProduct = async (req, res) => {
    // // SET STORAGE
    // var storage = multer.diskStorage({
    //   destination: function(req, file, callback) {
    //     callback(null, "../files/");
    //   },
    //   filename: function(req, file, callback) {
    //     callback(null, file.fieldname + "-" + Date.now());
    //   }
    // });
    
    // var upload = multer({ storage: storage }).array("image_file", 5);
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
      tax_fee,
      total_rating,
      total_rated_users
    } = req.body;

    
    // validation
    // image file validation
    if(util.isntOrEmpty(req.files)) return res.status(400).send({error : true, message : "product image required"});
    const image_file = req.files.image_file;
    if(util.isntOrNotImage(image_file)) return res.status(400).send({error : true, message : "selected image(s) contains invalid file type"});
    
    // if(util.isntOrEmpty(name)) return res.status(400).send({error : true, message : "product name required"});
    // if(!price || isNaN(price) || price == "") return res.status(400).send({error : true, message : "product price required, expecting an integer value"});
    // if(!quantity || isNaN(quantity) || quantity == "") return res.status(400).send({error : true, message : "product quantity required, expecting an integer value"});
    // if(!category || isNaN(category) || category == "") return res.status(400).send({error : true, message : "product category required, expecting an integer value"});
    // if(!brand || isNaN(brand) || brand == "") return res.status(400).send({error : true, message : "product brand required, expecting an integer value"});
    // if(!mini_desc ) return res.status(400).send({error : true, message : "product mini description required"});
    // if(!full_desc) return res.status(400).send({error : true, message : "product full desc required"});
    // if(!quantity || isNaN(quantity)) return res.status(400).send({error : true, message : "product quantity required, expecting an integer value"});

    
    let image_file_length = image_file.length;
    let image_array = [];
    if (image_file_length == undefined){
        image_file.name = "." + image_file.name.split(".").slice(-1)[0];
        let newName = Date.now() + "_egis_product" + image_file.name;
        image_file.mv("./app/files/images/" + newName)
        let image_url = ORIGIN + "/images" + "/" + newName
        image_array.push({
            image_url
        });
        console.log(image_url);
        console.log(image_array);
    }else{
        image_file.map(one_file => {
            one_file.name = "." + one_file.name.split(".").slice(-1)[0];
            let newName = Date.now() + "_egis_product" + one_file.name.replace(" ","");
            one_file.mv(`./app/files/images/` + newName)
            let image_url = ORIGIN + "/images" + "/" + newName
            image_array.push({
              image_url
            });
            console.log(image_url);
            console.log(image_array);
        })
    }

    res.send({
        message : "uploaded"
    })
    // console.log("yes")
    // return res.status(200).send({
    //     error : false,
    //     message : "products successfully created",
    //     data : __dirname + "../files"
    // })
    // await products.create({name, price, quantity}).then(data => {
    //   return res.status(201).send({
    //     error : false,
    //     message : "products successfully created",
    //     data : data
    //   }) 
    // }).catch(err => {
    //   return res.status(500).send({
    //     error : true,
    //     message : "an error ocurred, please try again later",
    //     error : err
    //   })
    // })

    // upload(req, res, function(err) {
    // //   console.log(req.body);
    //   console.log(req.files);
    //   if (err) {
    //     return res.end("Error uploading file.");
    //   }
    //   res.send("File is uploaded");
    // });



}