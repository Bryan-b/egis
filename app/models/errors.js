module.exports = (sequelize, Sequelize) => {
  const Errors = sequelize.define(
    "errors",
    {
      error_type: Sequelize.STRING
    },
    {
      underscored: true,
      timestamps: false
    }
  );
  return Errors;
};
