// Bamazon Manager
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

console.log('\n\r_____Welcome to the Bamazon Manager Dashboard_____');
dashboard();
// List a set of menu options: (inquire.prompt a list -- put this in a function to re-use)
//  View Products for Sale 
//  View Low Inventory
//  Add to Inventory
//  Add New Product SQL query: INSERT INTO products(item, department, price, stock) VALUES(answer.(choices))

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
            
                break;
            
            case 'Add New Product': 
            
                break;
            
            case 'Exit': 
                console.log('\nThanks for using the Bamazon Manager Dashboard\n');
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
        function(err, res) {
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
        function(err, res) {
            if (err) throw err;
            console.log('\x1b[31m%s\x1b[0m' ,'\n\rItems with inventory less than 15:');
            console.table(res);
            console.log('\n');
            dashboard();
        })
    }

    function addToInventory() {
    // add inquire.prompt to ask for 
    // connection.query(
    //     "SELECT * FROM products SET stock = answer.stock WHERE item_id = answer.product",
    //     function(err, res) {
    //         if (err) throw err;
    //         console.log('\x1b[32m%s\x1b[0m','\n\rInventory updated Successfully:');
    //         console.table(res[answer.product]);
    //         console.log('\n');
    //         dashboard();
    //     })
    }