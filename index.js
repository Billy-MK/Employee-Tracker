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
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Departments', 'Add Roles', 'Add Employees', 'Update Employee Role', 'Update Employee Manager'],
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
            case 'Update Employee Role':
                updateEmployeeRoles();
                break;
            case 'Update Employee Manager':
                updateEmployeeManagers();
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
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.department_id = departments.id;', (err, res) => {
        if (err) throw err;

        // Create an array which will be filled with other arrays containing each row's data. We start with a single array of column headers.
        var consoleTableArray = [['ID ', 'Title ', 'Salary ', 'Department ']];
        
        // Each row's data is put into rowArray, which is then pushed to consoleTableArray
        res.forEach((item) => {
            var rowArray = [];
            rowArray.push(item.id);
            rowArray.push(item.title);
            rowArray.push(item.salary);
            rowArray.push(item.name);
            consoleTableArray.push(rowArray);
        })

        // Use the console-table package to print the data
        consoleTable(consoleTableArray);

        main();
    })
}

const viewEmployees = () => {
    connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, employees.manager_id, roles.salary, departments.name FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id', (err, res) => {
        if (err) throw err;

        // Create an array which will be filled with other arrays containing each row's data. We start with a single array of column headers.
        var consoleTableArray = [['ID ', 'First Name ', 'Last Name ', 'Role ', 'Manager ', 'Salary ', 'Department ']];
        
        // Each row's data is put into rowArray, which is then pushed to consoleTableArray
        res.forEach((item) => {
            var rowArray = [];
            rowArray.push(item.id);
            rowArray.push(item.first_name);
            rowArray.push(item.last_name);
            rowArray.push(item.title);
            if (item.manager_id) {
                rowArray.push(item.manager_id)
            } else {
                rowArray.push('No Manager')
            }
            rowArray.push(item.salary);
            rowArray.push(item.name);
            consoleTableArray.push(rowArray);
        })

        // Use the console-table package to print the data
        consoleTable(consoleTableArray);

        main();
    })
}

const addDepartments = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department you would like to create?',
        }
    ]).then((answer) => {
        connection.query('INSERT INTO departments SET ?', {
            name: answer.name
        }, (err) => {
            if (err) throw err;
            console.log("Your department has been created!");

            main();
        })
    })
}

const addRoles = () => {
    // Queries for all the roles, to determine which department the role will be added to
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        // Prompts user for information regarding the role
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role you would like to create?',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?'
            },
            {
                name: 'department_name',
                type: 'rawlist',
                // The choices() function generates an array of choices based on the department names from the query above
                choices() {
                    const choiceArray = [];
                    res.forEach((department) => {
                      choiceArray.push(department.name);
                    });
                    return choiceArray;
                  },
                message: 'What department would you like this role to belong to?',
            }
        ]).then((answer) => {
            // chosenDepartment is a variable which will store the ID of the department, rather than using the name (since role takes department_id not department_name)
            let chosenDepartment;
            res.forEach((department) => {
                if (department.name === answer.department_name) {
                    chosenDepartment = department.id;
                }
            })
            // Role is generated and inserted based on answers and chosenDepartment
            connection.query('INSERT INTO roles SET ?', {
                title: answer.title,
                salary: answer.salary,
                department_id: chosenDepartment
            }, (err) => {
                if (err) throw err;
                console.log("Your role has been created!")
                main();
            })
        })
    })
}

const addEmployees = () => {
     // Queries for all the roles and employees, to determine which role the employee will be assigned and who their manager will be
     connection.query('SELECT * FROM employees', (err, employeeRes) => {
         if (err) throw err;
         connection.query('SELECT * FROM roles', (err, res) => {
            if (err) throw err;
            // Prompts user for information regarding the role
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: "What is the employee's first name?",
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "What is the employee's last name?"
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    // The choices() function generates an array of choices based on the department names from the query above
                    choices() {
                        const choiceArray = [];
                        res.forEach((role) => {
                          choiceArray.push(role.title);
                        });
                        return choiceArray;
                      },
                    message: "What is this employee's role?",
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    choices() {
                        employeeRes.forEach((employee) => {
                          choiceArray.push({
                              name: employee.first_name + " " + employee.last_name,
                              value: employee.id
                          });
                        });
                        return choiceArray;
                      },
                    message: "Who is this person's manager?."
                },
            ]).then((answer) => {
                // chosenRole is a variable which will store the ID of the role, rather than using the name
                let chosenRole;
                res.forEach((role) => {
                    if (role.title === answer.role) {
                        chosenRole = role.id;
                    }
                })
    
                // Role is generated and inserted based on answers and chosenDepartment
                connection.query('INSERT INTO employees SET ?', {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: chosenRole,
                    manager_id: answer.manager
                }, (err) => {
                    if (err) throw err;
                    console.log("Your employee has been created!")
                    main();
                })
            })
        })
     })
}

const updateEmployeeRoles = () => {
    connection.query('SELECT * FROM roles', (err, roleRes) => {
        if (err) throw err;
        connection.query('SELECT * FROM employees', (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    name: 'employee',
                    message: 'Which employee would you like to change the role of?',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach((employee) => {
                          choiceArray.push(
                              {
                                name: employee.first_name + ' ' + employee.last_name,
                                value: employee.id
                              }
                          );
                        });
                        return choiceArray;
                    }
                },
                {
                    name: 'newRole',
                    message: "What would you like to change this employee's role to?",
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        roleRes.forEach((role) => {
                          choiceArray.push(
                              {
                                name: role.title,
                                value: role.id
                              }
                          );
                        });
                        return choiceArray;
                    }
                }
            ]).then((answers) => {
                connection.query('UPDATE employees SET ? WHERE ?', [
                    {
                        role_id: answers.newRole
                    },
                    {
                        id: answers.employee
                    }
                ])
                console.log("Your employee's role has been updated!");
                main();
            })
        })
    })
}

const updateEmployeeManagers = () => {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'employee',
                message: 'Which employee would you like to change the manager of?',
                type: 'rawlist',
                choices() {
                    const choiceArray = [];
                    res.forEach((employee) => {
                      choiceArray.push(
                          {
                            name: employee.first_name + ' ' + employee.last_name,
                            value: employee.id
                          }
                      );
                    });
                    return choiceArray;
                }
            },
            {
                name: 'newManager',
                message: 'Which employee would you like to assign to be their manager?',
                type: 'rawlist',
                choices() {
                    const choiceArray = [];
                    res.forEach((employee) => {
                      choiceArray.push(
                          {
                            name: employee.first_name + ' ' + employee.last_name,
                            value: employee.id
                          }
                      );
                    });
                    return choiceArray;
                }
            }
        ]).then((answers) => {
            connection.query('UPDATE employees SET ? WHERE ?', [
                {
                    manager_id: answers.newManager
                },
                {
                    id: answers.employee
                }
            ])
            console.log("Your employee's manager has been changed!");
            main();
        })
    })
}

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the main function after the connection is made
    main();
  });
  