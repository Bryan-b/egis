const dbc = require("../config"); //database configuration
const Sequelize = require("sequelize");
require("sequelize-hierarchy")(Sequelize);

// Sequelize Initialization
const sequelize = new Sequelize(dbc.DB, dbc.USER, dbc.PASSWORD, {
  host: dbc.HOST,
  dialect: dbc.DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models Import
db.product_images = require("./product_images")(sequelize, Sequelize); // product images models
db.product_resources = require("./product_resources")(sequelize, Sequelize);
db.products = require("./products")(sequelize, Sequelize); // products models
db.categories = require("./categories")(sequelize, Sequelize); // categories models

// // ASSOCIATION
db.products.hasMany(db.product_images);
db.products.hasMany(db.product_resources);
db.product_images.belongsTo(db.products);

module.exports = db;
