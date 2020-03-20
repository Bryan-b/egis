module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define(
      "categories",
      {
        name: Sequelize.STRING,
        isVisible : {
          type : Sequelize.BOOLEAN,
          defaultValue: 1
        }
      },
      {
        underscored: true,
        timestamps: false
      }
  );
    Categories.isHierarchy({ onDelete: "CASCADE" });
    return Categories;
};
