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
    console.log('\x1b[33m%s\x1b[0m' ,'Welcome to Bamazon, home of the best deals in the known universe!');
    var query = connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            console.log("\n");
            for (var i=0; i<res.length; i++) {
              console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
            };
            console.log("\n");
            inquire.prompt([
                {
                    type: 'input',
                    name: 'productChoice',
                    message: "Please enter the id # of the item you would like to purchase:",
            },
            {
                type: 'number',
                message: "How many would you like?",
                name: "quantity"
            }
              ])
              .then(answer => {
                var userSelection = answer.productChoice;
                var reqAmount = answer.quantity;
                connection.query(
                    "SELECT * FROM products WHERE ?",
                    { item_id: userSelection },
                    function(err, res) {
                        if (err) throw err;
                        var inStock = res[0].stock - reqAmount;
                        console.log('we have ' + inStock + ' in stock');
                        // console.log("Great choice, the " + answer.productChoice);
                        console.log('\x1b[36m%s\x1b[0m', "The " + res[0].item + ", great choice! \nOne moment while I check to see if we have " + reqAmount + " available...");
                        if (res[0].stock >= reqAmount) {
                            processOrder(userSelection, inStock); 
                        } else {
                            console.log('\x1b[35m%s\x1b[0m', "So sorry; we're not able to process your order.")
                        }
                    },
              )})
        },
      )}

function processOrder(selection, amount) {
    console.log('\x1b[32m%s\x1b[0m', "Good news! Your order is being processed.")
    connection.query(
        "UPDATE products SET ? WHERE ?",
        {stock: amount},
        {item_id: selection}
    ), function(err, res) {
        if (err) throw err;
        console.log("\n");
        for (var i=0; i<res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
        };
}
}

displayItems();