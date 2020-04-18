module.exports = (sequelize, Sequelize) => {
    const Brands = sequelize.define(
        "brands",
        {
            name: Sequelize.STRING,
        },
        {
            underscored: true,
            timestamps: false
        }
    );

    return Brands;
};
