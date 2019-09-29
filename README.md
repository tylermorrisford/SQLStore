# SQLStore
A CLI retail database manager using Node and MYSQL.

## Index
1. How it works
2. Instructions
3. Built with

## How it works
This 'SQLStore' node app uses two files - bamazoncustomer.js, and bamazonManager.js - to manage inventory(on the Manager side) and make 'purchases' (on the customer side). Using bamazoncustomer.js, users can select items and the amounts they'd like to purchase. If the item is in stock at the selected quantity, the app calculates the total price and removes that quantity from stock. If that quantity is not in stock, the app, apologizes: "Sorry, we're unable to process your order." In either case, the user is then presented with the option to keep shopping or quit the app.

Using bamazonManager.js, users have several reporting methods; view all items, view a list of items that have low stock, add stock to a given item, and add a new item to the inventory(and soon, users will be able to remove items from inventory). Each reporting method uses a database query in order to update or return results. 

[Watch a screencast demo](https://drive.google.com/file/d/1gmcD1qJjFxAbsmeCyYdTYqb2YrUgYHI5/view)

## Instructions
### Setup
FIRST! You'll need to fork this repo and clone it to your computer; load that entire folder into VS Code (or your preferred editor), and from that directory, you'll need to run 
```sh
npm install
``` 
to install the packages and dependencies(in this case, mysql, inquirer and dotenv), and you'll need to create a database(in this case, call it 'bamazon') with a table(call it 'products') using an SQL client like MYSQL Workbench. Get MYSQL Workbench [here.](https://www.mysql.com/products/workbench/) I'm betting you noticed the mysql logo and thought, "cool, but what do dolphins have to do with mysql?". You are not alone my friend. [I googled it.](https://www.quora.com/Why-does-MySQL-use-a-dolphin-as-its-logo)

This app uses the dotenv package to hide the mysql username and password, which you'll need if you want to fork this project and add to it/change it and then store your work in a remote repo. Check [here](https://www.npmjs.com/package/dotenv) for instructions on how to set it up. An incredibly useful package. 

### Use
Are you feeling like more of a buyer, or a manager? Use node to run either file:
```sh
$ node bamazonManager.js
```
or
```sh
$ node bamazoncustomer.js
```

The Beatles went on and on about how you 'can't buy me love'. With this app, you literally can. Ok fine, you can't, but you *can* put a pricetag on it, run completely out of it, and then re-stock it at will.  
 
## Built with
* [Node](https://nodejs.org/en/) - Asynchronous, single-threaded js runtime environment
### npm packages
* [mysql](https://www.npmjs.com/package/mysql) - mysql queries
* [inquirer](https://www.npmjs.com/package/inquirer) - eloquent node UI
* [DotEnv](https://www.npmjs.com/package/dotenv) - keys and variable storage 
