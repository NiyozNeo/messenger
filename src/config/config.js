require("dotenv").config()

module.exports = {
    PORT: process.env.SERVER_PORT,
    TOKEN : process.env.JWT_TOKEN 
}