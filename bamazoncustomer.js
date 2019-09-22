require('dotenv').config();
var mysql = require("mysql");
var inquire = require("inquirer");
// 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: "bamazon"
});

function displayItems() {
    console.log('Welcome to Bamazon, home of the best deals in the known universe!')
    var query = connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            for (var i=0; i<res.length; i++) {
              console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
            }
            // console.log(res);
        }
    );
}
// for inventory check, create variable that stores item_id -1 as index of res
// then compare res[i].stock (may have to convert to number) to user request
displayItems();