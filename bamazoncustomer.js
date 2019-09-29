require('dotenv').config();
var mysql = require("mysql");
var inquire = require("inquirer");
// connect to mysql database using dotenv
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: "bamazon"
});

// function call
openStore();


// functions --- openStore, displayItems, transaction, updateStock, shopOrQuit
function openStore() {
    console.log('\x1b[33m%s\x1b[0m', '\n Welcome to Bamazon, home of the best deals in the known universe! \n');
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            transaction();
        })
}

function displayItems() {
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
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
            name: "quantity",
            message: "How many would you like?"
        }
    ])
        .then(answer => {
            var amount = answer.quantity;
            var stockQuery = "SELECT * FROM products WHERE ?";
            connection.query(stockQuery, { item_id: answer.productChoice }, function (err, res) {
                if (err) throw err;
                var inStock = res[0].stock - amount;
                var orderTotal = res[0].price * amount;
                console.log('\x1b[36m%s\x1b[0m', "\nThe " + res[0].item + ", great choice! \nOne moment while I check to see if we have " + amount + " available...");
                updateStock(res, amount, answer, orderTotal, inStock);
            });
        }
        )
};

function updateStock(res, amount, answer, orderTotal, inStock) {
    if (res[0].stock >= amount) {
        console.log('\x1b[32m%s\x1b[0m', "\n\rGood news! Your order is being processed. Your total is $" + orderTotal + ". \n");
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ stock: inStock },
            { item_id: answer.productChoice }],
            function (err, res) {
                if (err) throw err;
                shopOrQuit()
            })
    } else {
        console.log('Sorry, we\'re unable to process your order.');
        shopOrQuit()
    }
}

function shopOrQuit() {
    inquire.prompt([
        {
            type: 'confirm',
            name: "shop",
            message: "Would you like to keep shopping?"
        }
    ]).then(answer => {
        if (answer.shop) {
            displayItems();
            setTimeout(transaction, 300);
        } else {
            console.log('\x1b[31m%s\x1b[0m', '\n Thanks for shopping with Bamazon! We\'ve got all your money, and all your data kthxbai... \n\r\n\r');
            connection.end();
        }
    })
}