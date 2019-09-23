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
            console.log("\n");
            for (var i=0; i<res.length; i++) {
              console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
            };
            console.log("\n");
        },
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
                // console.log("Great choice, the " + answer.productChoice);
                console.log('\x1b[36m%s\x1b[0m', "The " + res[0].item + ", great choice! \nHold on a moment while I check our stock to see if we have " + reqAmount + " available...");
                if (res[0].stock >= reqAmount) {
                    processOrder()
                }
                // if item is in stock, run processOrder(); else log "sorry"
            },

      )}),
      
      )}

function processOrder() {

}

// for inventory check, create variable that stores item_id -1 as index of res
// then compare res[i].stock (may have to convert to number) to user request
displayItems();
// transaction();