// Dependencies
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const queries = require ('./queries');
const consTable = require ('console.table');


require('doteenv').config()


// Connection to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);


function appWelcome () {
console.log("***********************************")
console.log("*                                 *")
console.log("*        EMPLOYEE TRACKER         *")
console.log("*                                 *")
console.log("***********************************")
promptUser();
};

function promptUser () {
    inquirer.prompt  ({
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role',
                  'View All Departments', 'Add Departments', 'Quit'],
        name: 'userOperation',
    })
    .then(answers => {
        switch (answers.userOperation) {
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Departments':
                addDepartment();
                break;    
        }
    })
}

appWelcome ();

function addEmployee () {

    inquirer.prompt ({
        type: 'input',
        message: "What is the employee's first name?", 
        name: 'firstName', 
    },
    {
        type: 'input',
        message: "What is the employee's last name?", 
        name: 'lastName',
    }, 
    {
        type: 'list',
        message: "What is the employee's role?", 
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Account Manager',
                'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service'],
        name: 'employeeRole'
    },
    {
        type: 'list',
        message: "Who is the employee's manager?",
        choices: ['None', 'John Doe', 'Mike Chan'],
        name: 'employeeManager'
    })
    .then(answers => {
        db.query(`INSERT INTO employees (first_name, last_name) VALUES (id, ${answers.firstName}, ${answers.lastName})`, function (err, results) {
            if (err) throw err
            console.table(res)
            userPrompt()
        });
        db.query(`INSERT INTO roles (title) VALUES (${answers.employeeRole})`, function (err, results) {
            console.log(results);
        });
    }) 
}

function updateEmployee () {

    inquirer.prompt ({
        type: 'input',
        message: "Which employee's role do you want to update?", 
        name: 'employeeUpdate'
    },
    {
        type: 'list',
        message: 'Which role do you want to assign the selected employee?', 
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Account Manager',
                'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service'],
        name: 'newRole' 
    })
    .then(answers => {
        db.query(`UPDATE employees INTO departments (name) VALUES (${answers.departmentName})`, function (err, results) {
            console.log(results);
        });
    })
    appWelcome();
}

function addRole () {

    inquirer.prompt ({
        type: 'input',
        message: 'What is the name of the role?', 
        name: 'roleName'
    }, 
    
    {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'roleSalary'
    },

    {
        type: 'input', 
        message: 'Which department does the role belong to?',
        name: 'roleDeparment'
    })
    .then(answers => {
        db.query(`INSERT INTO roles (title, salary) VALUES (${answers.roleName}, ${answers.roleSalary})`, function (err, results) {
            console.log(results);
        });
        db.query(`INSERT INTO departments (name) VALUES (${answers.roleDepartment})`, function (err, results) {
            console.log(results);
        });
    }) 
    appWelcome();
}

function addDepartment () {
    
    inquirer.prompt ({
        type: 'input',
        message: 'What is the name of the department?', 
        name: 'departmentName'
    })
    .then(answers => {
        db.query(`INSERT INTO departments (name) VALUES (${answers.departmentName})`, function (err, results) {
            console.log(results);
        });
    })
    appWelcome();
}

function viewAllRoles () {

    db.query(`SELECT roles FROM employee_db`, function (err, results) {
        console.log(results);
    });
}

function viewAllDepartments () {
    db.query(`SELECT departments FROM employee_db`, function (err, results) {
        console.log(results);
    });
}
    appWelcome();