const util = require("../utility")
module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define(
    "products",
    {
      unique_id: Sequelize.STRING,
      name: Sequelize.STRING,
      price: Sequelize.INTEGER,
      quantity: Sequelize.INTEGER,
      category: Sequelize.INTEGER,
      brand: Sequelize.INTEGER,
      type: Sequelize.STRING,
      mini_description: Sequelize.TEXT,
      full_description: Sequelize.TEXT,
      specifications: Sequelize.TEXT,
      discount_rate: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      discount_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      shipping_fee: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tax_fee: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_rated_users: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      visibility: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      demo : {
        type : Sequelize.STRING,
      }
    },
    {
      underscored: true
    }
  );

  // Hooks to generate unique id before creation
  Products.beforeCreate(function(products, options) {
    products.unique_id = util.uniqId("egis-");
    products.price = util.trimInt(products.price);
    products.quantity = util.trimNum(products.quantity);
  });

  return Products;
};
