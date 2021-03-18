const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console-table');
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
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;

        // Create an array which will be filled with other arrays containing each row's data. We start with a single array of column headers.
        var consoleTableArray = [['ID ', 'Name ']];
        
        // Each row's data is put into rowArray, which is then pushed to consoleTableArray
        res.forEach((item) => {
            var rowArray = [];
            rowArray.push(item.id);
            rowArray.push(item.name);
            consoleTableArray.push(rowArray);
        })

        // Use the console-table package to print the data
        consoleTable(consoleTableArray);

        main();
    })
}

const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;

        // Create an array which will be filled with other arrays containing each row's data. We start with a single array of column headers.
        var consoleTableArray = [['ID ', 'Title ', 'Salary ', 'Department ID ']];
        
        // Each row's data is put into rowArray, which is then pushed to consoleTableArray
        res.forEach((item) => {
            var rowArray = [];
            rowArray.push(item.id);
            rowArray.push(item.title);
            rowArray.push(item.salary);
            rowArray.push(item.department_id);
            consoleTableArray.push(rowArray);
        })

        // Use the console-table package to print the data
        consoleTable(consoleTableArray);

        main();
    })
}

const viewEmployees = () => {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;

        // Create an array which will be filled with other arrays containing each row's data. We start with a single array of column headers.
        var consoleTableArray = [['ID ', 'First Name ', 'Last Name ', 'Role ', 'Manager ']];
        
        // Each row's data is put into rowArray, which is then pushed to consoleTableArray
        res.forEach((item) => {
            var rowArray = [];
            rowArray.push(item.id);
            rowArray.push(item.first_name);
            rowArray.push(item.last_name);
            rowArray.push(item.role_id);
            if (item.manager_id === null) {
                rowArray.push('No Manager')
            } else {
                rowArray.push(item.manager_id);
            }
            consoleTableArray.push(rowArray);
        })

        // Use the console-table package to print the data
        consoleTable(consoleTableArray);

        main();
    })
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
    // run the main function after the connection is made
    main();
  });
  