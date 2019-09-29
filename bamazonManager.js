// Bamazon Manager Dashboard
require('dotenv').config();
var mysql = require("mysql");
var inquire = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: "bamazon"
});

// function call --- load dashboard
console.log('\x1b[36m%s\x1b[0m', '\n\r_____Welcome to the Bamazon Manager Dashboard_____\n');
dashboard();

// functions --- dashboard, displayItems, displayLowInventory, addToInventory, stockUpdate, addNewItem
function dashboard() {
    inquire.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Dashboard: What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
        }
    ]).then(answer => {
        switch (answer.choice) {
            case 'View Products for Sale':
                displayItems();
                break;

            case 'View Low Inventory':
                displayLowInventory();
                break;

            case 'Add to Inventory':
                addToInventory();
                break;

            case 'Add New Product':
                addNewItem();
                break;

            case 'Exit':
                console.log('\x1b[36m%s\x1b[0m', '\nThanks for using the Bamazon Manager Dashboard.\n');
                connection.end();
                break;

            default:
                displayItems();
        }

    })
}

function displayItems() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.log('\n\rOur current inventory:');
            console.table(res);
            console.log('\n');
            dashboard();
        })
}

function displayLowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock < 15",
        function (err, res) {
            if (err) throw err;
            console.log('\x1b[31m%s\x1b[0m', '\n\rItems with inventory less than 15:');
            console.table(res);
            console.log('\n');
            dashboard();
        })
}

function addToInventory() {
    inquire.prompt([
        {
            type: 'list',
            name: 'product',
            message: 'Which product would you like to add stock to?',
            choices: ['t-shirt', 'jeans', 'jacket', 'running shoes', 'hiking shoes', 'boots', 'toothbrush', 'deodorant', 'shampoo', 'conditioner']
        },
        {
            type: 'number',
            name: 'stock',
            message: 'Enter the number of stock you would like to add'
        }
    ]).then(answer => {
        // get current stock, add answer.number to it, set stock to that number
        connection.query(
            "SELECT * FROM products WHERE ?",
            { item: answer.product },
            function (err, res) {
                if (err) throw err;
                var newStock = res[0].stock + answer.stock;
                stockUpdate(answer.product, newStock);
            }
        )
    })
}

function stockUpdate(item, stockNum) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{ stock: stockNum },
        { item: item }],
        function (err, res) {
            if (err) throw err;
            console.log('\x1b[32m%s\x1b[0m', '\n\rInventory updated successfully.\n');
            dashboard();
        })
}


function addNewItem() {
    inquire.prompt([
        {
            type: 'input',
            name: 'item',
            message: 'Enter the name of the new item:'
        },
        {
            type: 'input',
            name: 'dept',
            message: 'Enter the department of the new item:'
        },
        {
            type: 'input',
            name: 'price',
            message: 'Enter the price of the new item:'
        },
        {
            type: 'number',
            name: 'stock',
            message: 'Enter the total stock of the new item:'
        },
    ]).then(answer => {
        var insertProduct = [
            [answer.item, answer.dept, answer.price, answer.stock]
        ];
        var insertQuery = "INSERT INTO products (item, department, price, stock) VALUES ?";
        connection.query(insertQuery, [insertProduct],
            function (err, res) {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', '\n\rProduct added successfully.\n');
                dashboard();
            }
        )

    })
}    