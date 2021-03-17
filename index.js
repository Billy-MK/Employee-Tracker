const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dotenv = require('dotenv').config()

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
  
    // port
    port: 3306,
  
    // username
    user: process.env.DB_USER,
  
    // password
    password: process.env.DB_PASS,
    database: 'employees_db',
  });

const main = () => {
    inquirer.prompt(
        {
            name: 'mainMenu',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Departments', 'Add Roles', 'Add Employees', 'Update Employee Roles'],
        }
    ).then((answer) => {
        switch(answer.mainMenu) {
            case 'View Departments': 
                viewDepartments();
                break;
            case 'View Roles': 
                viewRoles();
                break;
            case 'View Employees': 
                viewEmployees();
                break;
            case 'Add Departments': 
                addDepartments();
                break;
            case 'Add Roles': 
                addRoles();
                break;
            case 'Add Employees':
                addEmployees();
                break;
            case 'Update Employee Roles':
                updateEmployeeRoles();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    })
}

const viewDepartments = () => {

}

const viewRoles = () => {
    
}

const viewEmployees = () => {
    
}

const addDepartments = () => {
    
}

const addRoles = () => {
    
}

const addEmployees = () => {
    
}

const updateEmployeeRoles = () => {
    
}

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the main function after the connection is made to prompt the user
    main();
  });
  