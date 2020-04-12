module.exports = (sequelize, Sequelize) => {
  const Product_Images = sequelize.define(
    "product_images",
    {
        product_image_url: Sequelize.STRING
    },
    {
      underscored: true
    }
  );

  return Product_Images;
};
