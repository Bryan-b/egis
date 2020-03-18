const dbc = require("../config/db.config"); //database configuration
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
db.categories = require("./categories.js")(sequelize, Sequelize); // categories models
db.errors = require("./errors.js")(sequelize, Sequelize); // errors models

// // ASSOCIATION
// db.users.hasMany(db.cards);
// db.cards.belongsTo(db.users, { foreignKey: "user_id" });

module.exports = db;
