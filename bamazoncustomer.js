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
            console.table(res);
        })
    }

    transaction();

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
                        connection.query(stockQuery, {item_id: answer.productChoice}, function(err, res) {
                            if (err) throw err;
                        var inStock = res[0].stock - amount;
                        var orderTotal = res[0].price * amount;
                        console.log("amount = " + amount);
                        console.log('\x1b[36m%s\x1b[0m', "The " + res[0].item + ", great choice! \nOne moment while I check to see if we have " + amount + " available...");
                        updateStock(res, amount, answer, orderTotal, inStock);
                    });                    
                    }
                      )};


                      function updateStock(res, amount, answer, orderTotal, inStock) {
                        if (res[0].stock >= amount) {
                            console.log('\x1b[32m%s\x1b[0m', "Good news! Your order is being processed. Your total is $" + orderTotal);
                            connection.query(
                            // "UPDATE products SET stock = " + inStock + " WHERE item_id = " + amount,
                            "UPDATE products SET stock = " + inStock + " WHERE item_id = " + "'" + answer.productChoice + "'",
                            // [{stock: inStock},
                            // {item_id: answer.productChoice}],
                            function(err, res) {
                                console.log('update query starting...');
                                
                            if (err) throw err;
                            displayItems();
                            })
                        } else {
                            console.log('Sorry, we\'re unable to process your order.');
                            connection.end();
                        }
                      }

// function displayItems() {
//     console.log('\x1b[33m%s\x1b[0m' ,'Welcome to Bamazon, home of the best deals in the known universe!');
//     var query = connection.query(
//         "SELECT * FROM products",
//         function(err, res) {
//             if (err) throw err;
//             console.table(res);
//             // search for console.table minus certain columns
//             inquire.prompt([
//                 {
//                     type: 'input',
//                     name: 'productChoice',
//                     message: "Please enter the id # of the item you would like to purchase:",
//             },
//             {
//                 type: 'number',
//                 message: "How many would you like?",
//                 name: "quantity"
//             }
//               ])
//               .then(answer => {
//                 var userSelection = (answer.productChoice - 1);
//                 var reqAmount = answer.quantity;
//                 var inStock = res[userSelection].stock - reqAmount;
//                 var orderTotal = res[userSelection].price * reqAmount;
//                 console.log('\x1b[36m%s\x1b[0m', "The " + res[userSelection].item + ", great choice! \nOne moment while I check to see if we have " + reqAmount + " available...");
//                 if (res[userSelection].stock >= reqAmount) {
//                     console.log('\x1b[32m%s\x1b[0m', "Good news! Your order is being processed. Your total is $" + orderTotal);
//                     console.log(inStock);
//                     console.log(userSelection);
//                     var query = connection.query(
//                         "UPDATE products SET stock = " + inStock + " WHERE item_id = " + "'" + answer.productChoice + "'",
//                         // the above works, the below query with placeholders does not
//                         // "UPDATE products SET ? WHERE ?",
//                     // {stock: inStock},
//                     // {item_id: answer.productChoice},
//                     function(err, res) {
//                         console.log('update query starting...');
//                     if (err) throw err;
//                     console.log(res);
//                     console.log("\n");
//                     for (var i=0; i<res.length; i++) {
//                       console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
//                     };
//                 }
//                     )} 
//                     else {
//                         console.log('\x1b[35m%s\x1b[0m', "So sorry; we're not able to process your order.");
//                         connection.end();
//                     }
//                 },
//                 )
//             },
//           ) 
//         }
                
                
                
                
                
                
                
//                 connection.query(
//                     "SELECT * FROM products WHERE ?",
//                     { item_id: userSelection },
//                     function(err, res) {
//                         if (err) throw err;
//                         console.log('we have ' + inStock + ' in stock');
//                         // console.log("Great choice, the " + answer.productChoice);
//                         if (res[0].stock >= reqAmount) {
//                             console.log('your order is being processed');
//                             // processOrder(userSelection, inStock); 
//                         } else {
//                             console.log('\x1b[35m%s\x1b[0m', "So sorry; we're not able to process your order.")
//                         }
//                     },
//               )})
//         },
//       )}

// function processOrder(selection, amount) {
//     console.log('\x1b[32m%s\x1b[0m', "Good news! Your order is being processed.")
//     var query = connection.query(
//         "UPDATE products SET ? WHERE ?",
//         {stock: amount},
//         {item_id: selection},
//         function(err, res) {
//         if (err) throw err;
//         console.log("\n");
//         for (var i=0; i<res.length; i++) {
//           console.log(res[i].item_id + " | " + res[i].item + " | " + res[i].price);      
//         };
// })
// }

// displayItems();