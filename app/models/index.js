const dbc = require("../config"); //database configuration
const {Sequelize, Op} = require("sequelize");
require("sequelize-hierarchy")(Sequelize);

// Sequelize Initialization
const sequelize = new Sequelize(dbc.DB, dbc.USER, dbc.PASSWORD, {
  host: dbc.HOST,
  dialect: dbc.DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

// Model Imports
db.product_images = require("./product_images")(sequelize, Sequelize); // product images models
db.product_resources = require("./product_resources")(sequelize, Sequelize);
db.products = require("./products")(sequelize, Sequelize); // products models
db.categories = require("./categories")(sequelize, Sequelize); // categories models
db.brands = require("./brands")(sequelize, Sequelize); // brands model


// Model Associations
db.products.hasMany(db.product_images, {onDelete : 'cascade', hooks : true});
db.products.hasMany(db.product_resources, {onDelete : 'cascade', hooks : true});
db.product_images.belongsTo(db.products);
db.product_resources.belongsTo(db.products);

module.exports = db;
