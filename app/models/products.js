const uniq = require("../utility")
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
      index_img : Sequelize.TEXT,
      mini_description: Sequelize.TEXT,
      full_description: Sequelize.TEXT,
      specifications: Sequelize.TEXT,
      discount_rate: {
        type: Sequelize.DECIMAL,
        defaultValue: 0.0
      },
      discount_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      shipping_fee: {
        type: Sequelize.INTEGER,
        defaultValue: 0.0
      },
      tax_fee: {
        type: Sequelize.INTEGER,
        defaultValue: 0.0
      },
      total_rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_rated_users: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    },
    {
      underscored: true
    }
  );

  // Hooks to generate unique id before creation
  Products.beforeCreate(function(products, options) {
    products.unique_id = uniq.uniq_id()
  });

  return Products;
};
