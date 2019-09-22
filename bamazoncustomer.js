var mysql = require("mysql");
var inquire = require("inquirer");
// 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // Use DOTENV to hide password
    password: "USE DOT ENV PACKAGE",
    database: "top5000"
});