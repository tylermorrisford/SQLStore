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

openStore();

function openStore() {
    console.log('\x1b[33m%s\x1b[0m' ,'\n Welcome to Bamazon, home of the best deals in the known universe!');
    var query = connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            transaction();
        })
    }

    function displayItems() {
        var query = connection.query(
            "SELECT * FROM products",
            function(err, res) {
                if (err) throw err;
                console.table(res);
            })
        }    

function transaction() {
    inquire.prompt([
        {
            type: 'number',
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
            var amount = answer.quantity;
            var stockQuery = "SELECT * FROM products WHERE ?";
            connection.query(stockQuery, { item_id: answer.productChoice }, function (err, res) {
                if (err) throw err;
                var inStock = res[0].stock - amount;
                var orderTotal = res[0].price * amount;
                console.log('\x1b[36m%s\x1b[0m', "The " + res[0].item + ", great choice! \nOne moment while I check to see if we have " + amount + " available...");
                updateStock(res, amount, answer, orderTotal, inStock);
            });
        }
        )
};


function updateStock(res, amount, answer, orderTotal, inStock) {
    if (res[0].stock >= amount) {
        console.log('\x1b[32m%s\x1b[0m', "Good news! Your order is being processed. Your total is $" + orderTotal);
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ stock: inStock },
            { item_id: answer.productChoice }],
            function (err, res) {
                if (err) throw err;
                displayItems();
            })
    } else {
        console.log('Sorry, we\'re unable to process your order.');
        connection.end();
    }
}

