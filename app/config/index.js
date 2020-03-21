require("dotenv").config();

module.exports = {
    HOST: process.env.host,
    USER: process.env.user,
    PASSWORD: process.env.password,
    DB: process.env.database,
    DIALECT: process.env.dialect,
    ORIGIN : process.env.origin,
    PORT : process.env.port
};
