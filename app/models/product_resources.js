module.exports = (sequelize, Sequelize) => {
  const Product_Resources = sequelize.define(
    "product_resources",
    {
        resource_name: Sequelize.STRING,
        resource_type: Sequelize.TEXT,
        resource_size: Sequelize.STRING,
        resource_url: Sequelize.STRING
    },
    {
      underscored: true
    }
  );

  return Product_Resources;
};
