const { brands, Op, sequelize, Sequelize } = require("../models");
const util = require("../utility");


// create unique brand
exports.createBrands = async (req, res) => {
    const { name } = req.body;

    try {
        if(util.isntOrEmpty(name)) throw "brand name required";

        let [brand, created] = await brands.findOrCreate({
            where : {
                name : util.sanitize(name)
            },
            defaults : {
                name : util.sanitize(name)
            }
        });

        if(created){
            return res.status(201).send({
                error: false,
                message: "brand created successfully",
                data: brand
            });
        }else{
            return res.status(200).send({
                error: true,
                message: `brand with name '${name}' already exist`
            });
        }
        
    } catch (error) {
        res.status(500).send({
          error: true,
          message: error || "an error occurred creating brand"
        });
    }
}


// list all brands
exports.listBrands = async (req, res) => {
    try {
        let allBrands = await brands.findAll();
        return res.status(200).send({
            error : false,
            message : "brands fetched successfull",
            data : allBrands
        })
    } catch (error) {
        res.status(500).send({
          error: true,
          message: error || "an error occurred fetching brand"
        });
    }
}


// update brand(name) by id
exports.updateBrands = async (req, res) => {
    let {id, name} = req.body;

    try{
        if(util.isntOrEmpty(util.sanitize(name))){
            res.status(400).send({
                error : true,
                message : 'brand name required'
            })
        }

        if(util.isntOrEmptyOrNaN(util.sanitize(id))){
            res.status(400).send({
                error : true,
                message : 'brand id required'
            })
        }

        let brandIdExist = await brands.findOne({where : {id}});
        let brandNameExist = await brands.findOne({ where: { name } });

        if(brandIdExist !== null){
            if(brandNameExist === null){
                let updateBrand = await brands.update({name},{where:{id}})
                if(updateBrand){
                    res.status(200).send({
                        error : false,
                        message : 'brand updated successfully'
                    })
                }else{
                    res.status(500).send({
                        error : true,
                        message : 'an error occurred.'
                    })
                }
            }else{
                throw `brand with name '${name}' already exist`;
            }
        }else{
            throw `brand with id '${id}' does not already exist`;
        }  
    }catch(error){
        res.status(500).send({
            error : true,
            message: error || "an error occurred while updating brands.",
        });  
    }
};



// delete brand by id
exports.deleteBrands = async (req, res) => {
    let id = req.params.id;

    try {
        if(util.isntOrEmptyOrNaN(id)){
            res.status(400).send({
                error: true,
                message: "brand id required"
            });
        }

        let isIdExist = await brands.findByPk(id);

        if (isIdExist === null){
            throw `brand with id ${id} does not exist`
        }else{
            await brands.destroy({
                where : {
                    id
                }
            }).then(item => {
                res.status(200).send({
                    error: true,
                    message: `brand with id ${id} deleted successfully`
                });
            })
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error || "an error occurred deleting brand"
        });
    }
}